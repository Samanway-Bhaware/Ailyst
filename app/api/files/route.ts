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

    const { name, type, size, content } = await request.json();

    // Validate the request
    if (!name || !type || !content) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Create the file record
    const file = await prisma.file.create({
      data: {
        name,
        type,
        size,
        content,
        userId: user.id,
      },
    });

    return NextResponse.json(file);
  } catch (error) {
    console.error('Error uploading file:', error);
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

    const files = await prisma.file.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        type: true,
        size: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}