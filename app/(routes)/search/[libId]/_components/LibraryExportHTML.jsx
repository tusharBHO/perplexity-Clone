// Plan B:
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";

let remarkGfm;
try {
    // Next.js sometimes requires .default
    remarkGfm = require("remark-gfm").default || require("remark-gfm");
} catch (e) {
    console.error("Failed to load remark-gfm", e);
}

export default function LibraryExportHTML({ library }) {
    return (
        <div className="p-6 text-sm font-sans">
            {/* Title + Metadata */}
            <h1 className="text-xl font-bold mb-2">{library.title}</h1>
            <hr className="my-3 border-gray-200" />

            {/* Loop items */}
            {library?.items.map((item, index) => (
                <div key={index} className="mb-6">
                    {/* Question */}
                    <div className="bg-gray-50 p-3 rounded mb-2">
                        <p className="text-gray-700 font-semibold">Prompt{index + 1}:</p>
                        <div className="prose prose-sm max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                            >
                                {item.content || "No prompt provided"}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {/* Answer */}
                    <div className="border-l-4 border-teal-600 bg-white p-3 rounded">
                        <p className="text-teal-700 font-semibold">Response:</p>
                        <div className="prose prose-sm max-w-none">
                            {item?.response ? (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                    className="prose prose-sm max-w-none"
                                >
                                    {item.response}
                                </ReactMarkdown>
                            ) : (
                                <p className="text-gray-400 italic">No response available</p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
