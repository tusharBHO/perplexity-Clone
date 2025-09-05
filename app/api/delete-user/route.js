// app/api/delete-user/route.js (or pages/api/delete-user.js)
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req) {
    try {
        const { userId } = await req.json();
        await clerkClient.users.deleteUser(userId);

        return new Response(JSON.stringify({ message: "User deleted" }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Failed to delete user" }), { status: 500 });
    }
}
