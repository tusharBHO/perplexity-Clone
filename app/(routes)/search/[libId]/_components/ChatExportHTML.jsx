// app/(routes)/search/[libId]/_components/ChatExportHTML.jsx
"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export default function ChatExportHTML({ chat }) {
    if (!chat) return null;

    return (
        <div className="p-6 text-sm font-sans">
            {/* Question */}
            <h1 className="text-lg font-bold mb-3">Prompt</h1>
            <div className="bg-gray-50 p-3 rounded mb-4">
                <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                    >
                        {chat.userSearchInput || "No prompt provided"}
                    </ReactMarkdown>
                </div>
            </div>

            {/* Response */}
            <h2 className="text-md font-semibold text-teal-700 mb-2">Response</h2>
            <div className="border-l-4 border-teal-600 bg-white p-3 rounded mb-4">
                <div className="prose prose-sm max-w-none">
                    {chat.aiResp ? (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw, rehypeHighlight]}
                        >
                            {chat.aiResp}
                        </ReactMarkdown>
                    ) : (
                        <p className="text-gray-400 italic">No response available</p>
                    )}
                </div>
            </div>

            {/* Sources */}
            {chat.searchResult?.length > 0 && (
                <>
                    <h2 className="text-md font-semibold text-teal-700 mb-2">Sources</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        {chat.searchResult.map((src, i) => (
                            <li key={i} className="text-blue-600">
                                <a href={src.link} target="_blank" rel="noopener noreferrer">
                                    {src.title || src.link}
                                </a>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
