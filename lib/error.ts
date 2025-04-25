// /lib/error.ts
export function errorResponse(message: string, status: number = 500) {
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  