// app/api/profile/update/route.js
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req) {
    try {
        const { userId } = auth(); // get the logged-in userId
        if (!userId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const { firstName, lastName } = await req.json();

        // Call Clerk server API
        const updatedUser = await clerkClient.users.updateUser(userId, {
            firstName,
            lastName,
        });

        return new Response(JSON.stringify(updatedUser), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}