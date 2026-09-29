import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import net from "net";

// Fallback in-memory rate limiter cuando Upstash no esté configurado o falle
const hits = new Map<string, { count: number; resetAt: number }>();

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, val] of hits) {
      if (now > val.resetAt) hits.delete(key);
    }
  }, 5 * 60 * 1000);
  if (typeof timer.unref === "function") {
    timer.unref();
  }
}

// Inicialización de Upstash Redis
let redis: Redis | null = null;
const ratelimitInstances = new Map<string, Ratelimit>();

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (upstashUrl && upstashToken) {
  try {
    redis = new Redis({
      url: upstashUrl,
      token: upstashToken,
    });
  } catch (err) {
    console.warn(
      "[rate-limit] Error al inicializar Upstash Redis. Fallback a memoria local:",
      err
    );
  }
} else {
  console.warn(
    "[rate-limit] UPSTASH_REDIS_REST_URL o UPSTASH_REDIS_REST_TOKEN no están configurados. " +
      "Se usará rate limiting en memoria local (no distribuido en serverless)."
  );
}

function getUpstashRatelimit(limit: number, windowMs: number): Ratelimit | null {
  if (!redis) return null;
  const key = `${limit}:${windowMs}`;
  let instance = ratelimitInstances.get(key);
  if (!instance) {
    const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
    instance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowSec} s` as `${number} s`),
      prefix: "kingbrake:ratelimit",
    });
    ratelimitInstances.set(key, instance);
  }
  return instance;
}

function inMemoryRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: true } | { success: false; retryAfter: number } {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true };
  }

  entry.count++;
  if (entry.count > limit) {
    return { success: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  return { success: true };
}

/**
 * Returns { success: true } if under limit, { success: false, retryAfter } if over.
 * @param key   unique identifier (e.g. IP + endpoint)
 * @param limit max requests in the window
 * @param windowMs window size in milliseconds
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ success: true } | { success: false; retryAfter: number }> {
  const upstash = getUpstashRatelimit(limit, windowMs);
  if (upstash) {
    try {
      const result = await upstash.limit(key);
      if (!result.success) {
        const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
        return { success: false, retryAfter };
      }
      return { success: true };
    } catch (err) {
      console.warn("[rate-limit] Error consultando Upstash Redis, fallback a memoria:", err);
      return inMemoryRateLimit(key, limit, windowMs);
    }
  }

  return inMemoryRateLimit(key, limit, windowMs);
}

/**
 * Helper: extract sanitized client IP from request headers.
 * Prioriza cabeceras confiables de infraestructura (Vercel, Cloudflare)
 * y valida formato de IP para evitar suplantación vía X-Forwarded-For.
 */
export function getClientIp(req: Request): string {
  // 1. Cabeceras inyectadas por proxies de confianza (no manipulables directamente por cliente)
  const vercelIp = req.headers.get("x-vercel-forwarded-for");
  if (vercelIp && net.isIP(vercelIp.trim())) {
    return vercelIp.trim();
  }

  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp && net.isIP(cfIp.trim())) {
    return cfIp.trim();
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp && net.isIP(realIp.trim())) {
    return realIp.trim();
  }

  // 2. X-Forwarded-For: sanitizar y tomar la primera IP válida
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const parts = forwardedFor.split(",").map((p) => p.trim());
    for (const part of parts) {
      if (net.isIP(part)) {
        return part;
      }
    }
  }

  return "127.0.0.1";
}

/**
 * Returns a 429 NextResponse if rate limit exceeded, or null if OK.
 */
export async function rateLimitResponse(
  req: Request,
  endpoint: string,
  limit: number,
  windowMs: number
): Promise<NextResponse | null> {
  const ip = getClientIp(req);
  const result = await rateLimit(`${endpoint}:${ip}`, limit, windowMs);
  if (!result.success) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo más tarde." },
      {
        status: 429,
        headers: { "Retry-After": String(result.retryAfter) },
      }
    );
  }
  return null;
}
