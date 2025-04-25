import { PrismaClient } from '@prisma/client';
import { errorResponse } from '../../../../lib/error';

const prisma = new PrismaClient();

// Create an Idea
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, source, userId, projectId, intentId } = body;

    if (!content || !source || !userId) {
      return errorResponse('No Idea not found', 400);
    }

    const idea = await prisma.idea.create({
      data: {
        content,
        source,
        user: { connect: { id: userId } },
        ...(projectId && { project: { connect: { id: projectId } } }),
        ...(intentId && { intent: { connect: { id: intentId } } }),
      },
    });

    return new Response(JSON.stringify(idea), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('POST /api/idea ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}

// Get All Ideas for a User
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return errorResponse('Missing userId', 400);
    }

    const ideas = await prisma.idea.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'desc' },
    });

    return new Response(JSON.stringify(ideas), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('GET /api/idea ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}
