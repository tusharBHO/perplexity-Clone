"use client"
import { Cpu, DollarSign, Globe, Palette, Star, Volleyball } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSearchCategory } from '../../../context/searchCategoryContext';
import FeaturedNewsCard from './_components/FeaturedNewsCard';
import SmallNewsCard from './_components/SmallNewsCard';
import DiscoverSkeleton from './_components/DiscoverSkeleton';

const Categories = [
    { title: 'Top', icon: Star },
    { title: 'Tech & Science', icon: Cpu },
    { title: 'Finance', icon: DollarSign },
    { title: 'Art & Culture', icon: Palette },
    { title: 'Sports', icon: Volleyball },
]

// Custom hook to track window width
function useWindowSize() {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return width;
}

function Discover() {
    const { searchCategory, setSearchCategory } = useSearchCategory();
    const [latestNews, setLatestNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const width = useWindowSize();

    useEffect(() => {
        searchCategory && GetSearchResult();
    }, [searchCategory]);

    const GetSearchResult = async () => {
        setLoading(true);
        try {
            const result = await axios.post('/api/brave-search-api', {
                searchInput: searchCategory + ' Latest News & Update',
                searchType: 'Search',
                count: 20,
            });
            const webSearchResult = result?.data?.web?.results;
            setLatestNews(webSearchResult || []);
        } finally {
            setLoading(false);
        }
    };

    // Determine small cards per row based on screen width
    let smallCardsPerRow = 3;  // Default for desktop
    if (width < 768) smallCardsPerRow = 1;      // Mobile
    else if (width < 1024) smallCardsPerRow = 2;  // Tablet

    const groupSize = 1 + smallCardsPerRow; // 1 Featured + X Small Cards

    // Create grouped data array for desktop/tablet view
    const groups = [];
    for (let startIndex = 0; startIndex < latestNews.length; startIndex += groupSize) {
        const group = latestNews.slice(startIndex, startIndex + groupSize);
        groups.push(group);
    }

    if (loading) {
        return <DiscoverSkeleton Categories={Categories} />;
    }

    // Mobile-only: show only featured cards with scroll snapping
    if (width < 768) {
        return (
            // <div className="md:ml-14 h-full w-full md:w-[calc(100%-3.5rem)] px-3 md:px-12 lg:px-20 pt-10 pb-5 bg-primary text-dark">
            <div className="md:ml-14 h-[100dvh] w-full md:w-[calc(100%-3.5rem)] px-3 md:px-12 lg:px-20 pt-10 pb-5 bg-primary text-dark">
                <h2 className="font-bold text-3xl flex gap-2 items-center">
                    <Globe className="text-accent h-7 w-7 pt-1" />
                    <span>Discover</span>
                </h2>

                <div className="flex mt-5 gap-2 flex-wrap">
                    {Categories.map((category, index) => {
                        const isActive = searchCategory === category.title;
                        return (
                            <div
                                key={index}
                                onClick={() => setSearchCategory(category.title)}
                                className={`flex gap-1 p-1 px-3 cursor-pointer items-center rounded-full border border-theme transition-colors bg-sHover-hover duration-300
                                        ${isActive
                                        ? 'bg-accent text-white border-accent'
                                        : 'bg-secondary text-muted hover:bg-accent/10 hover:text-dark'
                                    }`}
                            >
                                <category.icon className="h-4 w-4" />
                                <h2 className="text-sm">{category.title}</h2>
                            </div>
                        )
                    })}
                </div>

                {/* Mobile scroll snap container */}
                {/* <div className="overflow-y-scroll snap-y snap-mandatory h-[calc(100vh-214px)] mt-6 border-1 border-blue-400"> */}
                <div className="overflow-y-scroll snap-y snap-mandatory h-[calc(100dvh-214px)] mt-6">
                    {latestNews.map((news, idx) => (
                        // <div key={idx} className="snap-start h-[605px] mb-4 border-2 border-red-600">
                        <div key={idx} className="snap-start h-[605px] mb-0 flex flex-col items-center">
                            <FeaturedNewsCard news={news} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Tablet/Desktop: original grouped layout
    return (
        <div className="md:ml-14 h-full w-full md:w-[calc(100%-3.5rem)] px-3 md:px-12 lg:px-20 pt-10 pb-5 bg-primary text-dark">
            <h2 className="font-bold text-3xl flex gap-2 items-center">
                <Globe className="text-accent h-7 w-7 pt-1" />
                <span>Discover</span>
            </h2>

            <div className="flex mt-5 gap-2 flex-wrap">
                {Categories.map((category, index) => {
                    const isActive = searchCategory === category.title;
                    return (
                        <div
                            key={index}
                            onClick={() => setSearchCategory(category.title)}
                            className={`flex gap-1 p-1 px-3 cursor-pointer items-center rounded-full border border-theme transition-colors bg-sHover-hover duration-300
                                    ${isActive
                                    ? 'bg-accent text-white border-accent'
                                    : 'bg-secondary text-muted hover:bg-accent/10 hover:text-dark'
                                }`}
                        >
                            <category.icon className="h-4 w-4" />
                            <h2 className="text-sm">{category.title}</h2>
                        </div>
                    )
                })}
            </div>

            <div className="sm:mt-6 space-y-10 h-[calc(100dvh-220px)] sm:h-auto pt-6 sm:pt-0">
                {groups.map((group, groupIndex) => (
                    <div key={groupIndex} className="space-y-10">
                        <FeaturedNewsCard news={group[0]} />
                        {group.length > 1 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:mt-6">
                                {group.slice(1).map((news, idx) => (
                                    <SmallNewsCard news={news} key={idx} />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Discover;











// "use client"
// import { Cpu, DollarSign, Globe, Palette, Star, Volleyball } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { useSearchCategory } from '../../../context/searchCategoryContext';
// import FeaturedNewsCard from './_components/FeaturedNewsCard';
// import SmallNewsCard from './_components/SmallNewsCard';
// import DiscoverSkeleton from './_components/DiscoverSkeleton';

// const Categories = [
//     { title: 'Top', icon: Star },
//     { title: 'Tech & Science', icon: Cpu },
//     { title: 'Finance', icon: DollarSign },
//     { title: 'Art & Culture', icon: Palette },
//     { title: 'Sports', icon: Volleyball },
// ]

// // Custom hook to track window width
// function useWindowSize() {
//     const [width, setWidth] = useState(window.innerWidth);

//     useEffect(() => {
//         const handleResize = () => setWidth(window.innerWidth);
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     return width;
// }

// function Discover() {
//     const { searchCategory, setSearchCategory } = useSearchCategory();
//     const [latestNews, setLatestNews] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const width = useWindowSize();

//     useEffect(() => {
//         searchCategory && GetSearchResult();
//     }, [searchCategory]);

//     const GetSearchResult = async () => {
//         setLoading(true);
//         try {
//             const result = await axios.post('/api/brave-search-api', {
//                 searchInput: searchCategory + ' Latest News & Update',
//                 searchType: 'Search',
//                 count: 20,
//             });
//             const webSearchResult = result?.data?.web?.results;
//             setLatestNews(webSearchResult || []);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Determine small cards per row based on screen width
//     let smallCardsPerRow = 3;  // Default for desktop
//     if (width < 768) smallCardsPerRow = 1;      // Mobile
//     else if (width < 1024) smallCardsPerRow = 2;  // Tablet

//     const groupSize = 1 + smallCardsPerRow; // 1 Featured + X Small Cards

//     // Create grouped data array
//     const groups = [];
//     for (let startIndex = 0; startIndex < latestNews.length; startIndex += groupSize) {
//         const group = latestNews.slice(startIndex, startIndex + groupSize);
//         groups.push(group);
//     }

//     if (loading) {
//         return <DiscoverSkeleton Categories={Categories} />;
//     }

//     return (
//         <div className="md:ml-14 h-full w-full md:w-[calc(100%-3.5rem)] px-3 md:px-12 lg:px-20 pt-10 pb-5 bg-primary text-dark">
//             {/* Section header */}
//             <h2 className="font-bold text-3xl flex gap-2 items-center">
//                 <Globe className="text-accent h-7 w-7 pt-1" />
//                 <span>Discover</span>
//             </h2>

//             {/* Category selection buttons */}
//             <div className="flex mt-5 gap-2 flex-wrap">
//                 {Categories.map((category, index) => {
//                     const isActive = searchCategory === category.title;
//                     return (
//                         <div
//                             key={index}
//                             onClick={() => setSearchCategory(category.title)}
//                             className={`flex gap-1 p-1 px-3 cursor-pointer items-center rounded-full border border-theme transition-colors duration-300
//                             ${isActive
//                                     ? 'bg-accent text-white border-accent'
//                                     : 'bg-secondary text-muted hover:bg-accent/10 hover:text-dark'
//                                 }`}
//                         >
//                             <category.icon className="h-4 w-4" />
//                             <h2 className="text-sm">{category.title}</h2>
//                         </div>
//                     )
//                 })}
//             </div>

//             {/* Featured + Small Cards */}
//             {/* <div className="mt-6 space-y-10"> */}
//             <div className="sm:mt-6 space-y-10 h-[calc(100vh-220px)] sm:h-auto pt-6 sm:pt-0 overflow-y-scroll">
//                 {groups.map((group, groupIndex) => (
//                     <div key={groupIndex} className='space-y-10'>
//                         <FeaturedNewsCard news={group[0]} />

//                         {group.length > 1 && (
//                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:mt-6">
//                                 {group.slice(1).map((news, idx) => (
//                                     <SmallNewsCard news={news} key={idx} />
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     )
// }

// export default Discover;











// // app/(routes)/discover/page.jsx
// "use client"
// import { Cpu, DollarSign, Globe, Palette, Star, Volleyball } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { useSearchCategory } from '../../../context/searchCategoryContext';
// import FeaturedNewsCard from './_components/FeaturedNewsCard';
// import SmallNewsCard from './_components/SmallNewsCard';
// import DiscoverSkeleton from './_components/DiscoverSkeleton';

// const Categories = [
//     { title: 'Top', icon: Star },
//     { title: 'Tech & Science', icon: Cpu },
//     { title: 'Finance', icon: DollarSign },
//     { title: 'Art & Culture', icon: Palette },
//     { title: 'Sports', icon: Volleyball },
// ]

// function Discover() {
//     const { searchCategory, setSearchCategory } = useSearchCategory();
//     const [latestNews, setLatestNews] = useState([]);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         searchCategory && GetSearchResult();
//     }, [searchCategory])

//     const GetSearchResult = async () => {
//         setLoading(true);
//         try {
//             const result = await axios.post('/api/brave-search-api', {
//                 searchInput: searchCategory + ' Latest News & Update',
//                 searchType: 'Search',
//                 count: 20,
//             });
//             const webSearchResult = result?.data?.web?.results;
//             setLatestNews(webSearchResult || []);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return <DiscoverSkeleton Categories={Categories} />;
//     }

//     return (
//         <div className="md:ml-14 h-full w-full md:w-[calc(100%-3.5rem)] px-3 md:px-12 lg:px-20 pt-10 pb-5 bg-primary text-dark">
//             {/* Section header */}
//             <h2 className="font-bold text-3xl flex gap-2 items-center">
//                 <Globe className="text-accent h-7 w-7 pt-1" />
//                 <span>Discover</span>
//             </h2>

//             {/* Category selection buttons */}
//             <div className="flex mt-5 gap-2 flex-wrap">
//                 {Categories.map((category, index) => {
//                     const isActive = searchCategory === category.title;
//                     return (
//                         <div
//                             key={index}
//                             onClick={() => setSearchCategory(category.title)}
//                             className={`flex gap-1 p-1 px-3 cursor-pointer items-center rounded-full border border-theme transition-colors duration-300
//                             ${isActive
//                                     ? 'bg-accent text-white border-accent'
//                                     : 'bg-secondary text-muted hover:bg-accent/10 hover:text-dark'
//                                 }`}
//                         >
//                             <category.icon className="h-4 w-4" />
//                             <h2 className="text-sm">{category.title}</h2>
//                         </div>
//                     )
//                 })}
//             </div>

//             {/* Featured + Small Cards */}
//             <div className="mt-6 space-y-10">
//                 {latestNews.map((_, groupIndex) => {
//                     const startIndex = groupIndex * 4;
//                     const group = latestNews.slice(startIndex, startIndex + 4);

//                     if (group.length === 0) return null;

//                     return (
//                         <div key={groupIndex}>
//                             {/* First big featured card */}
//                             <FeaturedNewsCard news={group[0]} />

//                             {/* Next 3 small cards */}
//                             {group.length > 1 && (
//                                 // <div className="grid md:grid-cols-3 gap-4 mt-6">
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
//                                     {group.slice(1).map((news, idx) => (
//                                         <SmallNewsCard news={news} key={idx} />
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     )
// }

// export default Discover