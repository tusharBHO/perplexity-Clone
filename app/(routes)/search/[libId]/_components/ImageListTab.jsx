// app/(routes)/search/[libId]/_components/ImageListTab.jsx
import Image from "next/image";
import React from "react";
import { ImageOff } from 'lucide-react';

function ImageListTab({ chat, loading }) {
  const fallback = "/fallback.jpg"; // neutral placeholder image in /public
  const placeholders = Array.from({ length: 8 });

  return (
    // <div className="max-w-[80vw] mx-auto columns-2 sm:columns-3 md:columns-4 gap-4 mt-6 [column-fill:_balance]">
    <div className="columns-2 sm:columns-3 md:columns-4 gap-4 mt-6 [column-fill:_balance]">
      {loading ? (
        // Loading placeholders
        placeholders.map((_, index) => (
          <div
            key={index}
            className="relative mb-4 break-inside-avoid rounded-xl bg-secondary animate-pulse h-48 sm:h-56 md:h-64 shadow-md"
            aria-busy="true"
            aria-label="Loading image placeholder"
          />
        ))
      ) : chat?.searchResult?.length ? (
        // Actual images
        chat.searchResult.map((item, index) => (
          <div
            key={index}
            onClick={() => window.open(item.url, "_blank")}
            className="relative mb-4 break-inside-avoid overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer"
          >
            {item?.thumbnail ? (
              <div className="w-full overflow-hidden rounded-lg group">
                <img
                  src={item.thumbnail}
                  alt={item?.title || "Image"}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.src = fallback }}
                />
              </div>
            ) : (
              <div className="w-full h-35 bg-border flex items-center justify-center rounded-lg">
                <ImageOff className="w-8 h-8 text-muted" />
              </div>
            )}

            {/* Overlay */}
            <div className="absolute -bottom-1 left-0 pl-2 right-0 bg-black/30">
              <div
                onClick={() => window.open(item.url, "_blank")}
                className="flex gap-2 items-center mb-2 cursor-pointer"
              >
                <div className="relative w-3 h-3 rounded-full overflow-hidden">
                  <Image
                    src={item?.img || fallback}
                    alt={item?.title || "Source icon"}
                    fill
                    className="object-cover"
                  />
                </div>

                <span className="text-xs text-white truncate max-w-[160px]">
                  {item?.long_name || "Unknown Source"}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        // Empty state
        <p className="text-center text-muted mt-4">No images found</p>
      )}
    </div>
  );
}

export default ImageListTab;