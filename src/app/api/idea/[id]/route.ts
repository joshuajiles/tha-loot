import { PrismaClient } from '@prisma/client';
import { errorResponse } from '../../../../../lib/error';

const prisma = new PrismaClient();

// Get Single Idea
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const idea = await prisma.idea.findUnique({
      where: { id: Number(params.id) },
    });

    if (!idea) {
      return errorResponse('No Idea not found', 404);
    }

    return new Response(JSON.stringify(idea), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('GET /api/idea/:id ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}

// Update an Idea
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { content, source } = body;

    const idea = await prisma.idea.update({
      where: { id: Number(params.id) },
      data: {
        content,
        source,
      },
    });

    return new Response(JSON.stringify(idea), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('PUT /api/idea/:id ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}

// Delete an Idea
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.idea.delete({
      where: { id: Number(params.id) },
    });

    return new Response(null, { status: 204 });

  } catch (error) {
    console.error('DELETE /api/idea/:id ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}
