// app/(routes)/search/[libId]/_components/SourceList.jsx
import Image from "next/image";
import React from "react";

function SourceList({ webResult, loadingSearch }) {
    const fallback = "/fallback.jpg"; // neutral placeholder image in /public

    return (
        <div className="flex gap-0 md:gap-2 flex-wrap mt-3">
            {/* Show skeletons while loading */}
            {loadingSearch && !webResult && (
                <div className="flex flex-wrap gap-2 w-full">
                    {[1, 2, 3, 4].map((_, index) => (
                        <div
                            key={index}
                            className=" h-[28px] rounded-full bg-secondary animate-pulse w-[70px] sm:w-[90px] md:w-[110px] "
                        />
                    ))}
                </div>
            )}

            {/* Show real data */}
            {!loadingSearch &&
                webResult?.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => window.open(item.url, "_blank")}
                        className="flex items-center gap-2 px-1 sm:px-3 py-1 rounded-full 
                       bg-secondary hover:bg-accent/10 cursor-pointer 
                       transition-colors shadow-sm"
                    >
                        {/* Favicon */}
                        <Image
                            src={item?.img || "/fallback.png"}
                            alt={item?.name || ""}
                            width={16}
                            height={16}
                            className="rounded-sm"
                        />

                        {/* Site name */}
                        <span className="hidden sm:block text-xs text-dark truncate max-w-[100px]">
                            {item?.long_name || "Source"}
                        </span>
                    </div>
                ))}
        </div>
    );
}

export default SourceList;
