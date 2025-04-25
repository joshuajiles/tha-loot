import { PrismaClient } from '@prisma/client';
import { errorResponse } from '../../../../lib/error';


const prisma = new PrismaClient();

// Create User
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return errorResponse('Missing email or password', 400);
    }

    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });

    return new Response(JSON.stringify(user), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('POST /api/user ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}

// Get All Users
export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    console.log("request object:  ", request);
    

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('GET /api/user ERROR:', error);
    return errorResponse('Internal Server Error', 500);
  }
}
