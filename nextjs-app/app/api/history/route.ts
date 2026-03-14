import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/history - 获取所有历史记录
export async function GET() {
  try {
    const history = await prisma.history.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

// POST /api/history - 创建新记录
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { time, question, age, gender, tosses, interpretation } = body;

    const record = await prisma.history.create({
      data: {
        time,
        question,
        age,
        gender,
        tosses,
        interpretation,
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error('Error saving history:', error);
    return NextResponse.json(
      { error: 'Failed to save history' },
      { status: 500 }
    );
  }
}