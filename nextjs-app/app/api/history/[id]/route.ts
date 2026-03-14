import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE /api/history/[id] - 删除记录
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.history.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting history:', error);
    return NextResponse.json(
      { error: 'Failed to delete history' },
      { status: 500 }
    );
  }
}