// app/(routes)/discover/_components/FeaturedNewsCard.jsx
import React from 'react'
import Image from 'next/image'
import { ImageOff } from 'lucide-react'

function FeaturedNewsCard({ news }) {
    const fallback = "/fallback.jpg" // neutral placeholder in /public

    return (
        <div
            className="flex flex-col-reverse items-center sm:flex-row rounded-2xl cursor-pointer overflow-hidden transition border border-theme md:border-none bg-secondary sm:bg-primary w-[90vw] md:w-auto"
            onClick={() => window.open(news?.url, '_blank')}
        >
            {/* Left side: text */}
            <div className="p-4 sm:p-6 flex-1 flex flex-col justify-center">
                <h2 className="font-semibold text-2xl md:text-3xl text-dark text-accent-hover line-clamp-2 sm:line-clamp-none">
                    {news?.title}
                </h2>
                <p className="text-muted mt-3 line-clamp-3">
                    {news?.description?.replace(/<\/?strong>/g, '')}
                </p>
                <p className="text-xs text-muted mt-2">
                    Source: {news?.profile?.name || "Multiple"}
                </p>
                <p className="text-xs text-muted mt-2">
                    Published {news?.age || "Recently"}
                </p>
            </div>

            {/* Right side: image with fallback */}
            {news?.thumbnail?.original ? (
                <div className="pt-2 py-0 sm:p-0 rounded-t-xl w-[85vw] sm:w-1/2 h-72 sm:h-68 md:h-72 rounded-xl overflow-hidden">
                    {/* <img */}
                    <img
                        src={news.thumbnail.original}
                        alt={news?.title}
                        className="w-full h-full object-cover rounded-t-xl transform transition-transform duration-300 hover:scale-110"
                        onError={(e) => { e.currentTarget.src = fallback }}
                    />
                </div>
            ) : (
                <div className="w-[80vw] sm:w-1/2 h-72 rounded-t-xl sm:h-68 md:h-72 rounded-xl overflow-hidden">
                    <img
                        src={news.meta_url.favicon}
                        alt={news?.title}
                        className="w-full h-full object-cover rounded-t-xl transform transition-transform duration-300 hover:scale-110"
                        onError={(e) => { e.currentTarget.src = fallback }}
                    />
                </div>
            )}
        </div>
    )
}

export default FeaturedNewsCard
