import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, preferredDistributorId } = body;

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name || null;
    if (phone !== undefined) data.phone = phone || null;
    if (preferredDistributorId !== undefined)
      data.preferredDistributorId = preferredDistributorId || null;

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data,
      select: {
        id: true,
        name: true,
        phone: true,
        preferredDistributorId: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    return NextResponse.json(
      { error: 'Error al actualizar perfil' },
      { status: 500 }
    );
  }
}
