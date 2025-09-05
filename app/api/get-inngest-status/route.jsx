// app/api/get-inngest-status/route.jsx
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { runId } = await req.json()

    try {
        const result = await axios.get(process.env.INNGEST_SERVER_HOST + '/v1/events/' + runId + '/runs', {
        // const result = await axios.get(process.env.INNGEST_SERVER_HOST + '/v1/' + '/runs' + runId, {
            headers: {
                Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
            }
        });

        return NextResponse.json(result.data)
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}   