import { PrismaClient } from '@prisma/client';
import { errorResponse } from '../../../../../lib/error';

const prisma = new PrismaClient();

// Get Single Resource
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const resource = await prisma.resource.findUnique({
      where: { id: Number(params.id) },
    });

    if (!resource) {
      return errorResponse('Resource not found', 404);
    }

    return new Response(JSON.stringify(resource), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('GET /api/resource/:id ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}

// Update Resource
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { title, url, type } = body;

    const resource = await prisma.resource.update({
      where: { id: Number(params.id) },
      data: {
        title,
        url,
        type,
      },
    });

    return new Response(JSON.stringify(resource), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('PUT /api/resource/:id ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}

// Delete Resource
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.resource.delete({
      where: { id: Number(params.id) },
    });

    return new Response(null, { status: 204 });

  } catch (error) {
    console.error('DELETE /api/resource/:id ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}
