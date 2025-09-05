// app/(routes)/discover/_components/FeaturedNewsCard.jsx
import React from 'react'
import { ImageOff } from 'lucide-react'

function FeaturedNewsCard({ news }) {
    const fallback = "/fallback.jpg" // neutral placeholder in /public

    return (
        <div
            className="flex flex-col md:flex-row rounded-2xl cursor-pointer overflow-hidden transition"
            onClick={() => window.open(news?.url, '_blank')}
        >
            {/* Left side: text */}
            <div className="p-6 flex-1 flex flex-col justify-center">
                <h2 className="font-semibold text-2xl md:text-3xl text-dark text-accent-hover">
                    {news?.title}
                </h2>
                <p className="text-muted mt-3 line-clamp-3">
                    {news?.description?.replace(/<\/?strong>/g, '')}
                </p>
                <p className="text-xs text-muted mt-2">
                    Published {news?.age || "Recently"}
                </p>
            </div>

            {/* Right side: image with fallback */}
            {news?.thumbnail?.original ? (
                <div className="md:w-1/2 h-64 md:h-72 rounded-2xl overflow-hidden">
                    <img
                        src={news.thumbnail.original}
                        alt={news?.title}
                        className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                        onError={(e) => { e.currentTarget.src = fallback }}
                    />
                </div>
            ) : (
                <div className="md:w-1/2 h-64 md:h-72 rounded-2xl overflow-hidden">
                    <img
                        src={news.meta_url.favicon}
                        alt={news?.title}
                        className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                        onError={(e) => { e.currentTarget.src = fallback }}
                    />
                </div>
            )}
        </div>
    )
}

export default FeaturedNewsCard