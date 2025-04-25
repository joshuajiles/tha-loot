import { PrismaClient } from '@prisma/client';
import { errorResponse } from '../../../../lib/error';

const prisma = new PrismaClient();

// Create Intent OR Get all Intents for a User
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, type, userId } = body;

    if (!prompt || !type || !userId) {
      return errorResponse('Missing prompt, type, or userId', 404);
    }

    const intent = await prisma.intent.create({
      data: {
        prompt,
        type,
        user: { connect: { id: userId } },
      },
    });

    return new Response(JSON.stringify(intent), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('POST /api/intent ERROR:', error);
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

    const intents = await prisma.intent.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'desc' },
    });

    return new Response(JSON.stringify(intents), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('GET /api/intent ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}
