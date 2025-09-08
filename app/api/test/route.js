export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const data = await req.json();
    return new Response(
      JSON.stringify({ message: 'POST received', data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
