// app/api/signout-all/route.js (or pages/api/signout-all.js)
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req) {
    try {
        const { userId } = await req.json();
        const sessions = await clerkClient.sessions.getSessionsList({ userId });

        // Delete all sessions for this user
        for (const session of sessions) {
            await clerkClient.sessions.revokeSession(session.id);
        }

        return new Response(JSON.stringify({ message: "All sessions revoked" }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Failed to revoke sessions" }), { status: 500 });
    }
}
