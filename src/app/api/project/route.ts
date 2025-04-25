import { PrismaClient } from '@prisma/client';
import { errorResponse } from '../../../../lib/error';

const prisma = new PrismaClient();

// Create Project OR Get all Projects for a User
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, userId } = body;

    if (!title || !userId) {
      return errorResponse('Missing title or userId', 400);
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        user: { connect: { id: userId } },
      },
    });

    return new Response(JSON.stringify(project), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('POST /api/project ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return errorResponse('Missing userId', 400);
    }

    const projects = await prisma.project.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'desc' },
    });

    return new Response(JSON.stringify(projects), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('GET /api/project ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}
