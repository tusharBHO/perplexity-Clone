// app/(routes)/discover/page.jsx
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

function Discover() {
    const { searchCategory, setSearchCategory } = useSearchCategory();
    const [latestNews, setLatestNews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        searchCategory && GetSearchResult();
    }, [searchCategory])

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

    if (loading) {
        return <DiscoverSkeleton Categories={Categories} />;
    }

    return (
        <div className="md:ml-14 h-full w-full md:w-[calc(100%-3.5rem)] px-6 md:px-12 lg:px-20 pt-10 pb-5 bg-primary text-dark">
            {/* Section header */}
            <h2 className="font-bold text-3xl flex gap-2 items-center">
                <Globe className="text-accent" />
                <span>Discover</span>
            </h2>

            {/* Category selection buttons */}
            <div className="flex mt-5 gap-2 flex-wrap">
                {Categories.map((category, index) => {
                    const isActive = searchCategory === category.title;
                    return (
                        <div
                            key={index}
                            onClick={() => setSearchCategory(category.title)}
                            className={`flex gap-1 p-1 px-3 cursor-pointer items-center rounded-full border border-theme transition-colors duration-300
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

            {/* Featured + Small Cards */}
            <div className="mt-6 space-y-10">
                {latestNews.map((_, groupIndex) => {
                    const startIndex = groupIndex * 4;
                    const group = latestNews.slice(startIndex, startIndex + 4);

                    if (group.length === 0) return null;

                    return (
                        <div key={groupIndex}>
                            {/* First big featured card */}
                            <FeaturedNewsCard news={group[0]} />

                            {/* Next 3 small cards */}
                            {group.length > 1 && (
                                <div className="grid md:grid-cols-3 gap-4 mt-6">
                                    {group.slice(1).map((news, idx) => (
                                        <SmallNewsCard news={news} key={idx} />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Discover