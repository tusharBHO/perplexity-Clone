// app/(routes)/discover/_components/SmallNewsCard.jsx
import React from 'react'
import { ImageOff } from 'lucide-react'

function SmallNewsCard({ news }) {
    const fallback = "/fallback.jpg"

    return (
        <div
            className="border border-theme rounded-2xl cursor-pointer overflow-hidden hover:shadow-md transition bg-secondary"
            onClick={() => window.open(news?.url, '_blank')}
        >
            {news?.thumbnail?.original ? (
                <div className="w-full h-72 sm:h-45 overflow-hidden">
                    <img
                        src={news.thumbnail.original}
                        alt={news?.title}
                        className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                        onError={(e) => { e.currentTarget.src = fallback }}
                    />
                </div>

            ) : (
                <div className="w-full h-72 sm:h-45 bg-border flex items-center justify-center">
                    <ImageOff className="w-8 h-8 text-muted" />
                </div>
            )}

            <div className="p-4">
                <h2 className="font-medium text-2xl sm:text-lg text-dark line-clamp-2 text-accent-hover">
                    {news?.title}
                </h2>
                <p className="sm:text-xs text-muted mt-2 line-clamp-3 sm:line-clamp-2">
                    {news?.description?.replace(/<\/?strong>/g, '')}
                </p>
                <p className="text-xs text-muted mt-2">
                    Source: {news?.profile?.name || "Multiple"}
                </p>
                <p className="text-xs text-muted mt-2">
                    Published {news?.age || "Recently"}
                </p>
            </div>
        </div>
    )
}

export default SmallNewsCard









// // app/(routes)/discover/_components/SmallNewsCard.jsx
// import React from 'react'
// import { ImageOff } from 'lucide-react'

// function SmallNewsCard({ news }) {
//     const fallback = "/fallback.jpg"

//     return (
//         <div
//             className="border border-theme rounded-2xl cursor-pointer overflow-hidden hover:shadow-md transition bg-secondary"
//             onClick={() => window.open(news?.url, '_blank')}
//         >
//             {news?.thumbnail?.original ? (
//                 <div className="w-full h-45 overflow-hidden">
//                     <img
//                         src={news.thumbnail.original}
//                         alt={news?.title}
//                         className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
//                         onError={(e) => { e.currentTarget.src = fallback }}
//                     />
//                 </div>

//             ) : (
//                 <div className="w-full h-45 bg-border flex items-center justify-center">
//                     <ImageOff className="w-8 h-8 text-muted" />
//                 </div>
//             )}

//             <div className="p-4">
//                 <h2 className="font-medium text-lg text-dark line-clamp-2 text-accent-hover">
//                     {news?.title}
//                 </h2>
//                 <p className="text-xs text-muted mt-2 line-clamp-2">
//                     {news?.description?.replace(/<\/?strong>/g, '')}
//                 </p>
//                 <p className="text-xs text-muted mt-2">
//                     Source: {news?.profile?.name || "Multiple"}
//                 </p>
//             </div>
//         </div>
//     )
// }

// export default SmallNewsCard