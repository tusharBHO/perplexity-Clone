// app/(routes)/search/[libId]/_components/SourceListTab.jsx
import Image from "next/image";
import React from "react";

function SourceListTab({ chat, loadingSearch }) {
    const fallback = "/fallback.jpg"; // keep a neutral placeholder image in /public

    // Array for skeleton placeholders
    const placeholders = Array.from({ length: 6 });

    return (
        <div className="space-y-3 mt-4">
            {loadingSearch ? (
                // Loading skeleton placeholders
                placeholders.map((_, index) => (
                    <div
                        key={index}
                        className="p-4 border border-theme rounded-lg shadow-sm bg-secondary animate-pulse h-24"
                        aria-busy="true"
                        aria-label="Loading source placeholder"
                    >
                        <div className="flex gap-2 items-center mb-2">
                            <span className="text-sm font-medium text-muted bg-muted rounded w-4 h-4 inline-block animate-pulse" />
                            <div className="w-5 h-5 rounded-full bg-muted animate-pulse" />
                            <span className="text-xs text-muted rounded bg-muted w-[100px] h-4 inline-block animate-pulse" />
                        </div>
                        <h2 className="line-clamp-1 font-semibold text-dark text-base bg-muted rounded w-[200px] h-5 animate-pulse" />
                        <p className="mt-1 text-sm text-muted leading-snug bg-muted rounded w-full h-10 animate-pulse" />
                    </div>
                ))
            ) : chat?.searchResult?.length ? (
                // Actual sources
                chat.searchResult.map((item, index) => (
                    <div
                        key={index}
                        className="p-4 border border-theme rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-secondary"
                    >
                        {/* Top row: index, favicon, source */}
                        <div onClick={() => window.open(item.url, "_blank")} className="flex gap-2 items-center mb-2 cursor-pointer">
                            <span className="text-sm font-medium text-muted">{index + 1}.</span>

                            <div className="relative w-5 h-5 rounded-full overflow-hidden">
                                <Image
                                    src={item?.img || fallback}
                                    alt={item?.title || "Source icon"}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <span className="text-xs text-muted truncate max-w-[160px]">
                                {item?.long_name || "Unknown Source"}
                            </span>
                        </div>

                        {/* Title */}
                        <h2 onClick={() => window.open(item.url, "_blank")} className="line-clamp-1 font-semibold text-dark text-base cursor-pointer">
                            {item?.title || "Untitled"}
                        </h2>

                        {/* Description with HTML rendering */}
                        <p
                            className="mt-1 text-sm text-muted leading-snug"
                            dangerouslySetInnerHTML={{ __html: item?.description || "" }}
                        />
                    </div>
                ))
            ) : (
                // Empty state
                <p className="text-center text-muted mt-4">No sources found</p>
            )}
        </div>
    );
}

export default SourceListTab;