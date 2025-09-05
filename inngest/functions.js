// inngest/functions.js
import { supabase } from "../services/supabase";
import { inngest } from "./client";

export const llmModel = inngest.createFunction(
    { id: "llm-model" },
    { event: "llm-model" },

    async ({ event, step }) => {
        const chosen = event.data.model || "gemini-2.5-flash"; // default Gemini

        // Call Gemini AI model
        const aiResp = await step.ai.infer("gemini-call", {
            model: step.ai.models.gemini({
                model: chosen,
                apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
            }),
            body: {
                contents: [
                    {
                        role: "model",
                        parts: [
                            {
                                text:
                                    "Depends on user input sources, Summarize and search about topic, " +
                                    "Give me markdown text with proper formatting. User input is: " +
                                    event.data.searchInput,
                            },
                        ],
                    },
                    {
                        role: "user",
                        parts: [{ text: JSON.stringify(event.data.searchResult) }],
                    },
                ],
            },
        });

        const aiRespText =
            aiResp?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Save AI response into Supabase
        const saveToDb = await step.run("saveToDb", async () => {
            const { data, error } = await supabase
                .from("Chats")
                .update({ aiResp: aiRespText })
                .eq("id", event.data.recordId)
                .select();

            if (error) {
                throw new Error("Supabase error: " + error.message);
            }
            return data;
        });

        return saveToDb;
    }
);