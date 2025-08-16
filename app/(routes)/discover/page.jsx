"use client"
import { Cpu, DollarSign, Globe, Palette, Star, Volleyball } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { SEARCH_RESULT } from '@/services/shared'
import NewsCard from './_components/newsCard'

const options = [
    {
        title: 'Top',
        icon: Star
    },
    {
        title: 'Tech & Science',
        icon: Cpu
    },
    {
        title: 'Finance',
        icon: DollarSign
    },
    {
        title: 'Art & Culture',
        icon: Palette
    },
    {
        title: 'Sports',
        icon: Volleyball
    },
]

function Discover() {
    const [selectedOption, setSelectedOption] = useState('Top');
    const [latestNews, setLatestNews] = useState([]);
    // const [latestNews, setLatestNews] = useState(SEARCH_RESULT.web.results);

    useEffect(() => {
        selectedOption && GetSearchResult();
    }, [selectedOption])

    const GetSearchResult = async () => {
        const result = await axios.post('/api/brave-search-api', {
            searchInput: selectedOption + 'Latest News & Update',
            searchType: 'Search'
        })
        // console.log('result.data', result.data)

        const webSearchResult = result?.data?.web?.results
        setLatestNews(webSearchResult)
    }

    return (
        <div className='px-10 md:px-20 lg:px-36 xl:px-56 mt-20'>
            <h2 className='font-bold text-3xl flex gap-2 items-center'> <Globe /> <span>Discover</span></h2>

            <div className='flex mt-5'>
                {options.map((option, index) => (
                    <div key={index} onClick={() => setSelectedOption(option.title)}
                        className={`flex gap-1 p-1 px-3 hover:text-primary cursor-pointer items-center rounded-full
                    ${selectedOption == option.title && 'bg-accent text-primary'}`}>
                        <option.icon className='h-4 w-4' />
                        <h2 className='text-sm'>{option.title}</h2>
                    </div>
                ))}
            </div>

            <div>
                {latestNews.map((news, index) => (
                    <NewsCard news={news} key={index} />
                ))}
            </div>
        </div>
    )
}

export default Discover