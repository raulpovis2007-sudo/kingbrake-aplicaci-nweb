"use client";

import { useEffect, useState, useRef, Fragment } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./Timeline.module.css";

interface Milestone {
  id: string;
  year: number;
  month: number | null;
  title: string;
  description: string | null;
  image: string | null;
}

const ITEMS_PER_ROW = 4;

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function RowGroup({
  items,
  rowIndex,
  isLast,
}: {
  items: Milestone[];
  rowIndex: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const isLTR = rowIndex % 2 === 0;

  return (
    <Fragment>
      <motion.div
        ref={ref}
        className={`${styles.row} ${isLTR ? styles.rowLTR : styles.rowRTL}`}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {items.map((m) => (
          <div key={m.id} className={styles.milestone}>
            <div className={styles.msTop}>
              {m.image && (
                <img
                  src={m.image}
                  alt={m.title}
                  className={styles.msImage}
                  loading="lazy"
                />
              )}
            </div>
            <div className={styles.msCenter}>
              <div className={styles.msDot} />
            </div>
            <div className={styles.msBottom}>
              <span className={styles.msYear}>{m.year}</span>
              <p className={styles.msTitle}>{m.title}</p>
              {m.description && (
                <p className={styles.msDesc}>{m.description}</p>
              )}
            </div>
          </div>
        ))}
      </motion.div>

      {!isLast && (
        <div
          className={`${styles.turn} ${isLTR ? styles.turnRight : styles.turnLeft}`}
        >
          <div className={styles.turnDot} />
          <div className={styles.turnLine} />
          <div className={styles.turnDot} />
        </div>
      )}
    </Fragment>
  );
}

export default function Timeline() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    fetch("/api/timeline")
      .then((r) => r.json())
      .then((data: Milestone[]) => {
        if (Array.isArray(data)) setMilestones(data);
      })
      .catch(() => {});
  }, []);

  if (milestones.length === 0) return null;

  const rows = chunk(milestones, ITEMS_PER_ROW);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>Nuestro recorrido</span>
        <h2 className={styles.heading}>Hitos que nos definen</h2>
      </div>
      <div className={styles.track}>
        {rows.map((row, i) => (
          <RowGroup
            key={i}
            items={row}
            rowIndex={i}
            isLast={i === rows.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
