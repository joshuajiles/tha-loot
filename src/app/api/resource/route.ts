import { PrismaClient } from '@prisma/client';
import { errorResponse } from '../../../../lib/error';

const prisma = new PrismaClient();

// Create a Resource
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, url, type, userId, projectId } = body;

    if (!title || !url || !type || !userId) {
      return errorResponse('Missing required fields (title, url, type, userId)', 400);
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        url,
        type,
        user: { connect: { id: userId } },
        ...(projectId && { project: { connect: { id: projectId } } }),
      },
    });

    return new Response(JSON.stringify(resource), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('POST /api/resource ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}

// Get All Resources for a User
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return errorResponse('Missing userId', 400);
    }

    const resources = await prisma.resource.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'desc' },
    });

    return new Response(JSON.stringify(resources), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('GET /api/resource ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}
