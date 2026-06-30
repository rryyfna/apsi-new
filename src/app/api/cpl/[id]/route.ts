import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { kode, deskripsi, deskripsiEn, ikMappings } = body;

    const cpl = await prisma.cPL.update({
      where: { id },
      data: {
        kode,
        deskripsi,
        deskripsiEn,
      },
    });

    if (ikMappings && Array.isArray(ikMappings)) {
      // Unlink previous mappings
      await prisma.iK.updateMany({
        where: { cplId: id },
        data: { cplId: null, bobot: 0 }
      });

      // Link new mappings
      for (const m of ikMappings) {
        await prisma.iK.update({
          where: { id: m.ikId },
          data: {
            cplId: id,
            bobot: parseFloat(m.bobot) || 0
          }
        });
      }
    }

    return NextResponse.json(cpl);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Kode CPL sudah digunakan' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.cPL.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
