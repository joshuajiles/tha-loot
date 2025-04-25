import { PrismaClient } from '@prisma/client';
import { errorResponse } from '../../../../../lib/error';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: Number(params.id) },
    });

    if (!project) {
      return errorResponse('Project not found', 404);
    }

    return new Response(JSON.stringify(project), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('GET /api/project/:id ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { title, description } = body;

    const project = await prisma.project.update({
      where: { id: Number(params.id) },
      data: {
        title,
        description,
      },
    });

    return new Response(JSON.stringify(project), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('PUT /api/project/:id ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.project.delete({
      where: { id: Number(params.id) },
    });

    return new Response(null, {
      status: 204,
    });

  } catch (error) {
    console.error('DELETE /api/project/:id ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}
