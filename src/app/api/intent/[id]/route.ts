import { PrismaClient } from '@prisma/client';
import { errorResponse } from '../../../../../lib/error';


const prisma = new PrismaClient();

// Get a single intent
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const intent = await prisma.intent.findUnique({
      where: { id: Number(params.id) },
    });

    if (!intent) {
      return errorResponse('Intent not found', 404);
    }

    return new Response(JSON.stringify(intent), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('GET /api/intent/:id ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}

// Update an intent
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { prompt, type } = body;

    const intent = await prisma.intent.update({
      where: { id: Number(params.id) },
      data: {
        prompt,
        type,
      },
    });

    return new Response(JSON.stringify(intent), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('PUT /api/intent/:id ERROR:', error);
   return errorResponse('Internal Server Error', 500);
  }
}

// Delete an intent
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.intent.delete({
      where: { id: Number(params.id) },
    });

    return new Response(null, { status: 204 });

  } catch (error) {
    console.error('DELETE /api/intent/:id ERROR:', error);
   return errorResponse('Internal Server Error', 500);
  }
}
