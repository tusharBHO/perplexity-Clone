import React from 'react';
import { Globe } from 'lucide-react';

// Reusable skeleton block with pulse animation and responsive sizing
function DiscoverSkeleton({ Categories }) {
    return (
        <div className="md:ml-14 h-full w-full md:w-[calc(100%-3.5rem)] px-6 md:px-12 lg:px-20 pt-10 pb-5 bg-primary text-dark">
            {/* Header */}
            <h2 className="font-bold text-3xl flex gap-2 items-center mb-5">
                <Globe className="text-accent" />
                <span>Discover</span>
            </h2>

            {/* Category buttons skeleton */}
            <div className="flex mt-5 gap-2 flex-wrap">
                {Categories.map((category, index) => (
                    <div
                        key={index}
                        className="flex gap-1 px-3 py-1 items-center rounded-full border border-theme bg-secondary animate-pulse cursor-not-allowed select-none"
                    >
                        <category.icon className="h-4 w-4 text-muted" />
                        <h2 className="text-sm text-muted">{category.title}</h2>
                    </div>
                ))}
            </div>

            {/* Grouped card skeletons */}
            <div className="mt-6 space-y-10">
                {[...Array(3)].map((_, groupIndex) => (
                    <div key={groupIndex}>
                        {/* Featured big card skeleton */}
                        <div className="bg-secondary rounded-2xl h-64 md:h-72 w-full animate-pulse" />

                        {/* Small cards skeleton */}
                        <div className="grid md:grid-cols-3 gap-4 mt-6">
                            {[...Array(3)].map((__, idx) => (
                                <div
                                    key={idx}
                                    className="bg-secondary rounded-2xl h-44 w-full animate-pulse"
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DiscoverSkeleton;
