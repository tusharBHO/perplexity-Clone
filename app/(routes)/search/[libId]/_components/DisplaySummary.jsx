// app/(routes)/search/[libId]/_components/DisplaySummary.jsx
"use client";
import React, { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Copy, ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";
import ResourceCard from "./ResourceCard"; // adjust path if needed
import { supabase } from "@/services/supabase";

export default function DisplaySummary({ aiResp, libId, chatId, onDelete, isDeletable }) {
    const responseRef = useRef(null);
    const [copiedAll, setCopiedAll] = useState(false);
    const [feedback, setFeedback] = useState(null); // "like" | "dislike" | null
    const [toast, setToast] = useState(null); // message string
    const renderedLinks = new Set();
    const [deleting, setDeleting] = useState(false);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 1500);
    };

    const handleCopyAll = async () => {
        if (!responseRef.current) return;
        try {
            const container = document.createElement("div");
            container.innerHTML = responseRef.current.innerHTML;

            const getText = (element) => {
                let text = "";

                element.childNodes.forEach((node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        text += node.textContent;
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        const tag = node.tagName;

                        if (tag === "PRE") {
                            text += node.innerText + "\n";
                        } else if (tag === "LI") {
                            text += "- " + getText(node).trim() + "\n";
                        } else if (tag === "TR") {
                            const cells = Array.from(node.querySelectorAll("td, th")).map((td) =>
                                td.innerText.trim()
                            );
                            text += cells.join("\t") + "\n";
                        } else if (tag === "TABLE") {
                            node.querySelectorAll("tr").forEach((row) => {
                                const cells = Array.from(row.querySelectorAll("td, th")).map((td) =>
                                    td.innerText.trim()
                                );
                                text += cells.join("\t") + "\n";
                            });
                        } else {
                            text += getText(node) + "\n";
                        }
                    }
                });

                return text;
            };

            const text = getText(container).trim();
            await navigator.clipboard.writeText(text);
            setCopiedAll(true);
            showToast("Copied successfully!");
            setTimeout(() => setCopiedAll(false), 1500);
        } catch (err) {
            console.error("Copy all failed", err);
        }
    };

    const handleFeedback = (type) => {
        if (type === "like") {
            setFeedback(feedback === "like" ? null : "like");
            showToast("Thanks for your feedback!");
        } else {
            setFeedback(feedback === "dislike" ? null : "dislike");
            showToast("Sorry for inconvenience!");
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            const { error } = await supabase
                .from("Chats")
                .delete()
                .eq("id", chatId); // delete by libId

            if (error) throw error;

            showToast("Chat deleted!");
            // Call parent update so UI refreshes
            if (onDelete) onDelete(chatId);
        } catch (err) {
            console.error("Delete failed:", err.message);
            showToast("Failed to delete!");
        }
        finally {
            setDeleting(false);
        }
    };

    return (
        <div className="mt-4 relative">
            {/* Skeleton Loading */}
            {!aiResp && (
                <div className="space-y-3">
                    <div className="h-4 w-[98%] sm:w-[95%] bg-secondary rounded-md animate-pulse"></div>
                    <div className="h-4 w-[92%] sm:w-[88%] bg-secondary rounded-md animate-pulse"></div>
                    <div className="h-4 w-[97%] sm:w-[93%] bg-secondary rounded-md animate-pulse"></div>
                    <div className="h-4 w-[85%] sm:w-[75%] bg-secondary rounded-md animate-pulse"></div>
                    <div className="h-4 w-[60%] sm:w-[50%] bg-secondary rounded-md animate-pulse"></div>
                </div>
            )}

            {/* AI Response */}
            {aiResp && (
                <div
                    className="prose prose-sm max-w-none
            prose-headings:text-dark prose-p:text-muted01
            prose-a:text-accent prose-li:text-muted01
            prose-blockquote:text-muted01 prose-blockquote:border-accent"
                >
                    <div ref={responseRef}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw, rehypeHighlight]}
                            components={{
                                h1: ({ node, ...props }) => (
                                    <h1 className="text-3xl font-semibold text-dark01 mb-4" {...props} />
                                ),
                                h2: ({ node, ...props }) => (
                                    <h2 className="text-2xl font-semibold text-dark01 mb-3" {...props} />
                                ),
                                h3: ({ node, ...props }) => (
                                    <h3 className="text-xl font-semibold text-dark01 mt-4 mb-2" {...props} />
                                ),
                                p: ({ node, ...props }) => (
                                    <p className="text-[17px] text-muted01 leading-relaxed mb-3" {...props} />
                                ),

                                a: ({ node, ...props }) => (
                                    <ResourceCard href={props.href}>{props.children}</ResourceCard>
                                ),
                                ul: ({ node, ...props }) => (
                                    <ul
                                        className="list-disc list-inside space-y-1 text-muted01 leading-relaxed"
                                        {...props}
                                    />
                                ),
                                // li: ({ node, ...props }) => <li className="mb-1 text-muted01 text-[16px]" {...props} />,
                                li: ({ node, ordered, checked, ...props }) => <li className="mb-1 text-muted01 text-[16px]" {...props} />,
                                blockquote: ({ node, ...props }) => (
                                    <blockquote
                                        className="bg-secondary/40 p-3 rounded-lg text-muted01 leading-relaxed mb-4 border-l-4 border-accent"
                                        {...props}
                                    />
                                ),

                                strong: ({ node, ...props }) => (
                                    <strong className="font-semibold text-dark01" {...props} />
                                ),
                                em: ({ node, ...props }) => <em className="italic text-muted01" {...props} />,
                                del: ({ node, ...props }) => (
                                    <del className="line-through text-muted01/70" {...props} />
                                ),
                                hr: ({ node, ...props }) => (
                                    <hr className="border-t border-border my-4" {...props} />
                                ),
                                img: ({ node, ...props }) => (
                                    <img
                                        className="max-w-full rounded-lg border border-border shadow-sm my-3"
                                        alt=""
                                        {...props}
                                    />
                                ),
                                ol: ({ node, ...props }) => (
                                    <ol className="list-decimal list-inside space-y-1 text-muted01 leading-relaxed" {...props} />
                                ),
                                table: ({ node, ...props }) => (
                                    <div className="overflow-x-auto my-4">
                                        <table
                                            className="w-full border-collapse rounded-lg text-xs border border-border"
                                            {...props}
                                        />
                                    </div>
                                ),
                                th: ({ node, ...props }) => (
                                    <th
                                        className="border border-border px-3 py-2 bg-secondary font-medium text-dark text-left"
                                        {...props}
                                    />
                                ),
                                td: ({ node, ...props }) => (
                                    <td className="border border-border px-3 py-2 text-muted01" {...props} />
                                ),
                                tr: ({ node, ...props }) => (
                                    <tr className="even:bg-secondary/40 hover:bg-secondary/60 transition-colors" {...props} />
                                ),
                                code: ({ node, inline, className, children, ...props }) => {
                                    const match = /language-(\w+)/.exec(className || "");
                                    const [copied, setCopied] = useState(false);

                                    const extractText = (nodes) => {
                                        return React.Children.toArray(nodes)
                                            .map((child) => {
                                                if (typeof child === "string") return child;
                                                if (child?.props?.children) return extractText(child.props.children);
                                                return "";
                                            })
                                            .join("");
                                    };

                                    const handleCopy = async () => {
                                        try {
                                            const text = extractText(children);
                                            await navigator.clipboard.writeText(text);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 1500);
                                        } catch (err) {
                                            console.error("Copy failed", err);
                                        }
                                    };

                                    if (!inline && match) {
                                        return (
                                            <div className="relative my-4">
                                                <button
                                                    onClick={handleCopy}
                                                    className="absolute top-2 right-2 px-2 py-1 rounded-md text-xs bg-secondary text-muted01 hover:bg-accent hover:text-primary transition-colors flex items-center gap-1"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                    {copied ? "Copied!" : "Copy"}
                                                </button>

                                                <pre
                                                    className="rounded-lg overflow-x-auto p-3 bg-[#F3F3EE] text-dark dark:bg-[#1F2121] dark:text-gray-200"
                                                >
                                                    <code className={`language-${match[1]} text-sm leading-relaxed font-mono`} {...props}>
                                                        {children}
                                                    </code>
                                                </pre>
                                            </div>
                                        );
                                    }

                                    return (
                                        <code
                                            className="px-1.5 py-0.5 rounded text-sm font-mono bg-secondary/60 text-accent dark:bg-gray-800 dark:text-accent"
                                            {...props}
                                        >
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {aiResp}
                        </ReactMarkdown>
                    </div>
                </div>
            )}

            {/* Copy All Button + Like/Dislike */}
            <div className="flex items-center gap-3 my-4">
                <button
                    onClick={handleCopyAll}
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-secondary text-muted01 cursor-pointer bg-sHover-hover transition-colors"
                    title={copiedAll ? "Copied!" : "Copy All"}
                >
                    <Copy
                        className="w-3 h-3"
                        fill={copiedAll ? "#b0b0b0" : "none"}
                    />
                </button>

                <div className="flex items-center gap-2">
                    {/* Like */}
                    <button
                        onClick={() => handleFeedback("like")}
                        className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-secondary text-muted01 bg-sHover-hover transition-colors"
                    >
                        <ThumbsUp
                            className="w-3 h-3"
                            fill={feedback === "like" ? "#b0b0b0" : "none"}
                        />
                    </button>

                    {/* Dislike */}
                    <button
                        onClick={() => handleFeedback("dislike")}
                        className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-secondary text-muted01 bg-sHover-hover transition-colors"
                    >
                        <ThumbsDown
                            className="w-3 h-3"
                            fill={feedback === "dislike" ? "#b0b0b0" : "none"}
                        />
                    </button>

                    {/* Delete */}
                    {/* {isDeletable && (
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-secondary text-muted01 hover:text-dark transition-colors"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    )} */}
                    {isDeletable && (
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors 
            ${deleting
                                    ? "bg-secondary text-muted01 opacity-50 cursor-not-allowed"
                                    : "bg-secondary text-muted01 hover:text-dark"}`}
                        >
                            {deleting ? (
                                <span className="animate-spin w-3 h-3 border-2 border-muted01 border-t-transparent rounded-full"></span>
                            ) : (
                                <Trash2 className="w-3 h-3" />
                            )}
                        </button>
                    )}

                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-[-2.5rem] px-3 py-1.5 text-xs rounded-md bg-dark text-white shadow-md animate-fadeIn">
                    {toast}
                </div>
            )}
        </div>
    );
}