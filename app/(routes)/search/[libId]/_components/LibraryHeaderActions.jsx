"use client";
import { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
    EllipsisVertical,
    Plus,
    FileText,
    FileDown,
    FileType,
    Trash2,
    Share2,
} from "lucide-react";

// Plan B:
import LibraryExportHTML from "./LibraryExportHTML";

import { Edit2, Check, X } from "lucide-react"; // icons for edit/save/cancel
import { supabase } from '@/services/supabase';
import { useRouter } from "next/navigation";

export default function LibraryHeaderActions({ library, onTitleChange }) {
    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(library?.title || "My bad");
    const router = useRouter();


    useEffect(() => {
        setTitle(library?.title || "My Library");
    }, [library?.title]);

    const handleShare = async () => {
        try {
            const url = window.location.href;

            // Use native share if supported
            if (navigator.share) {
                await navigator.share({ url });
            } else {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (err) {
            console.error("Share failed:", err);
        }
    };

    const handleSaveTitle = async () => {
        try {
            const { error } = await supabase
                .from('Library')
                .update({ searchInput: title })
                .eq('libId', library.libId); // make sure you use libId, not id

            if (error) throw error;

            setIsEditing(false);

            // Optional: update parent state if needed
            // If you pass a callback from parent, call it here:
            onTitleChange?.(title);

        } catch (err) {
            console.error('Failed to update title', err.message);
            alert('Failed to update title.');
        }
    };

    // Plan B:
    const handleExportPDF = async () => {
        const html = document.getElementById("export-content").innerHTML;

        const response = await fetch("/api/export-pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                html,
                title: library?.title || "Library",
            }),
        });

        if (!response.ok) {
            console.error("Failed to generate PDF");
            return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${(library?.title || "library").replace(/[^\w\s-]/g, "")}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportMarkdown = () => {
        if (!library) return;

        let mdContent = `# ${library.title}\n\n`;

        library.items.forEach((item, index) => {
            mdContent += `## Prompt ${index + 1}\n`;
            mdContent += `${item.content || "No prompt provided"}\n\n`;

            mdContent += `**Response:**\n\n`;
            mdContent += `${item.response || "_No response available_"}\n\n`;
            mdContent += `---\n\n`;
        });

        // Create a blob and download
        const blob = new Blob([mdContent], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${(library?.title || "library").replace(/[^\w\s-]/g, "")}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDeleteLibrary = async () => {
        if (!library) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete "${library.searchInput}"? This action cannot be undone.`
        );
        if (!confirmed) return;

        try {
            const { error } = await supabase
                .from('Library')
                .delete()
                .eq('libId', library.libId);

            if (error) throw error;

            router.push("/"); // redirect to search page
            alert('Library deleted successfully!');
            // optional: redirect or clear state
            // e.g., navigate("/search") if using Next.js router
        } catch (err) {
            console.error('Failed to delete library', err.message);
            alert('Failed to delete library.');
        }
    };

    if (!library) return null;
    return (
        <>
            {/* Share Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="hover:bg-secondary rounded-full relative"
                title="Share"
            >
                <Share2 className="text-dark" />
                {copied && (
                    <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs bg-dark text-white px-2 py-0.5 rounded-md">
                        Copied!
                    </span>
                )}
            </Button>

            <Popover>
                {/* Trigger button */}
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="p-2 rounded-md hover:bg-secondary border border-theme"
                    >
                        <EllipsisVertical className="w-5 h-5 text-dark rotate-90" />
                    </Button>
                </PopoverTrigger>

                {/* Popover box */}
                <PopoverContent
                    align="end"
                    sideOffset={6}
                    className="w-56 p-2 rounded-xl shadow-lg border border-theme bg-primary text-dark"
                >
                    {/* Title */}
                    <div className="px-2 py-1.5 flex items-center justify-between text-xs font-medium text-dark">
                        {!isEditing ? (
                            <>
                                <span>{title}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="p-1"
                                    onClick={() => setIsEditing(true)}
                                    title="Edit Title"
                                >
                                    <Edit2 className="w-4 h-4 text-accent" />
                                </Button>
                            </>
                        ) : (
                            <div className="flex gap-2 w-full items-center">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="border border-theme rounded px-1 py-0.5 text-xs flex-1"
                                    autoFocus
                                />
                                <div className="flex gap-2 items-center">
                                    <Button
                                        variant="ghost"
                                        size="8"
                                        onClick={handleSaveTitle}
                                        title="Save"
                                    >
                                        <Check className="w-4 h-4 text-green-500" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="8"
                                        onClick={() => {
                                            setTitle(library.title ?? "My Library"); // reset
                                            setIsEditing(false);
                                        }}
                                        title="Cancel"
                                    >
                                        <X className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <hr className="my-2 border-theme" />

                    {/* Plan B: */}
                    {/* The hidden export area */}
                    <div id="export-content" className="hidden">
                        <LibraryExportHTML library={library} />
                    </div>
                    {/* Your export button */}
                    <Button
                        variant="ghost"
                        className="!pl-1 w-full h-7 justify-start gap-2 text-xs text-dark hover:bg-secondary"
                        onClick={handleExportPDF}
                    >
                        <FileText style={{ scale: 0.85 }} className="text-accent" /> Export as PDF
                    </Button>

                    <Button
                        variant="ghost"
                        className="!pl-1 w-full h-7 justify-start gap-2 text-xs text-dark hover:bg-secondary"
                        onClick={handleExportMarkdown}
                    >
                        <FileDown style={{ scale: 0.85 }} className="text-accent" /> Export as Markdown
                    </Button>

                    <hr className="my-2 border-theme" />

                    {/* Danger item */}
                    <Button
                        variant="ghost"
                        className="!pl-1 w-full h-7 justify-start gap-2 text-xs text-red-500 hover:text-red-600 hover:bg-secondary"
                        onClick={handleDeleteLibrary}
                    >
                        <Trash2 style={{ scale: 0.85 }} className="w-4 h-4" /> Delete
                    </Button>

                </PopoverContent>
            </Popover>
        </>
    );
}