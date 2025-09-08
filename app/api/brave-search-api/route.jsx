// // app/api/brave-search-api/route.jsx
// import { NextResponse } from "next/server";
// import axios from "axios";

// export async function POST(req) {
//     const { searchInput, searchType, count } = await req.json();

//     if (searchInput) {
//         const result = await axios.get(
//             `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(searchInput)}&count=${count || 10}`,
//             {
//                 headers: {
//                     'Accept': 'application/json',
//                     'Accept-Encoding': 'gzip',
//                     'X-Subscription-Token': process.env.BRAVE_API_KEY
//                 }
//             }
//         );

//         return NextResponse.json(result.data);
//     } else {
//         return NextResponse.json({ error: 'Please pass user search query!' });
//     }
// }








// app/api/brave-search-api/route.jsx
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
    const { searchInput, searchType, count } = await req.json();

    if (!process.env.BRAVE_API_KEY) {
        console.error('Missing BRAVE_API_KEY in env.');
        return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    if (!searchInput) {
        return NextResponse.json(
            { error: 'Please pass user search query!' },
            { status: 400 }
        );
    }

    try {
        const result = await axios.get(
            `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(searchInput)}&count=${count || 10}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'X-Subscription-Token': process.env.BRAVE_API_KEY
                }
            }
        );

        return NextResponse.json(result.data);
    } catch (err) {
        console.error('Brave Search API Error:', err.response?.data || err.message || err);

        return NextResponse.json(
            { error: 'Failed to fetch search results from Brave API.' },
            { status: 500 }
        );
    }
};








// // app/api/brave-search-api/route.jsx
// import { NextResponse } from "next/server";
// import axios from "axios";

// export async function POST(req) {
//     try {
//         const { searchInput, searchType, count } = await req.json();

//         if (!searchInput) {
//             return NextResponse.json(
//                 { error: "Please pass user search query!" },
//                 { status: 400 }
//             );
//         }

//         const result = await axios.get(
//             `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(
//                 searchInput
//             )}&count=${count || 10}`,
//             {
//                 headers: {
//                     Accept: "application/json",
//                     "X-Subscription-Token": process.env.BRAVE_API_KEY,
//                 },
//             }
//         );

//         return NextResponse.json(result.data);
//     } catch (error) {
//         if (error.response?.status === 429) {
//             return NextResponse.json(
//                 {
//                     error: "Rate limit exceeded",
//                     details: error.response?.data || "Too many requests, slow down!",
//                 },
//                 { status: 429 }
//             );
//         }

//         console.error("Brave API error:", error.response?.data || error.message);

//         return NextResponse.json(
//             {
//                 error: "Failed to fetch from Brave API",
//                 details: error.response?.data || error.message,
//             },
//             { status: error.response?.status || 500 }
//         );
//     }

// }








