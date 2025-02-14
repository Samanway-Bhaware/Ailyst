import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const { fileId, query, result } = await request.json();

    const analysis = await prisma.analysis.create({
      data: {
        query,
        result,
        fileId,
        userId: user.id,
      },
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error saving analysis:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const analyses = await prisma.analysis.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { file: true },
    });

    return NextResponse.json(analyses);
  } catch (error) {
    console.error('Error fetching analyses:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}