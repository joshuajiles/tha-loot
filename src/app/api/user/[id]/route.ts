import { PrismaClient } from '@prisma/client';
import { errorResponse } from '../../../../../lib/error';

const prisma = new PrismaClient();

// Get Single User
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(params.id) },
    });

    if (!user) {
      return errorResponse('User not found', 404);
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('GET /api/user/:id ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}

// Update User
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    const user = await prisma.user.update({
      where: { id: Number(params.id) },
      data: {
        email,
        name,
        password,
      },
    });

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('PUT /api/user/:id ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}

// Delete User
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.user.delete({
      where: { id: Number(params.id) },
    });

    return new Response(null, { status: 204 });

  } catch (error) {
    console.error('DELETE /api/user/:id ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}
