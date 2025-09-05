// app/api/llm-model/route.js
import { inngest } from "../../../inngest/client";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { searchInput, searchResult, recordId, model } = await req.json();
    // console.log("🧪 Model received in API route:", model);

    const inngestRunId = await inngest.send({
        name: "llm-model",
        data: {
            searchInput: searchInput,
            searchResult: searchResult,
            recordId: recordId,
            model: model
        },
    });

    return NextResponse.json({
        runId: inngestRunId.ids[0],
        modelUsed: model
    });
}