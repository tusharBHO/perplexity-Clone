"use client"
import React from "react"

export default function LibrarySkeleton({ items = 5 }) {
    return (
        <div className="mt-5 space-y-4">
            {Array.from({ length: items }).map((_, index) => (
                <div
                    key={index}
                    className="animate-pulse group rounded-xl border border-theme bg-secondary p-4 flex justify-between items-center"
                >
                    {/* Left side */}
                    <div className="space-y-3 w-full">
                        <div className="h-5 bg-border rounded w-3/5"></div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-border rounded-full"></div>
                            <div className="h-3 bg-border rounded w-1/4"></div>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-5">
                        <div className="h-5 w-5 bg-border rounded-full"></div>
                        <div className="h-5 w-5 bg-border rounded-full"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}
