// app/(routes)/search/[libId]/_components/DisplayResult.jsx
import React, { useEffect, useState } from "react";
import { ArrowRight, Link, Loader2Icon } from "lucide-react";
import { LucideImage, LucideList, LucideSparkles, Send } from 'lucide-react';
import AnswerDisplay from "./AnswerDisplay";
import axios from "axios";
import { supabase } from '../../../../../services/supabase';
import { useParams } from "next/navigation";
import ImageListTab from "./ImageListTab";
import SourceListTab from "./SourceListTab";
import { Button } from "../../../../../components/ui/button";
import { useAiModel } from "../../../../../context/aiModelContext";
import AudioRecorder from "../../../../_components/AudioRecorder";
import LibraryHeaderActions from "./LibraryHeaderActions";
import ScrollToBottomButton from "./ScrollToBottomButton";
import { useRef } from "react";

const tabs = [
    { label: 'Answer', icon: LucideSparkles },
    { label: 'Images', icon: LucideImage },
    { label: 'Sources', icon: LucideList, Badge: 10 },
];

function DisplayResult({ searchInputRecord }) {
    const [activeTab, setActiveTab] = useState('Answer');
    const [searchResult, setSearchResult] = useState('');
    const { libId } = useParams();
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [userInput, setUserInput] = useState();
    const { aiModel } = useAiModel(''); supabase
    const [library, setLibrary] = useState(buildLibrary(searchInputRecord));
    const scrollRef = useRef();

    const handleTranscriptChange = (transcript) => {
        setUserInput((prev) => (prev ? prev + " " + transcript : transcript));
    };

    const handleLibraryTitleChange = (newTitle) => {
        setLibrary(prev => ({ ...prev, title: newTitle }));
    };

    useEffect(() => {
        searchInputRecord?.Chats?.length == 0 ? GetSearchApiResult() : GetSearchRecords();
        setSearchResult(searchInputRecord);
    }, [searchInputRecord]);

    useEffect(() => {
        setLibrary(buildLibrary(searchResult));
    }, [searchResult]);

    const GetSearchApiResult = async () => {
        setLoadingSearch(true);
        const result = await axios.post('/api/brave-search-api', {
            searchInput: userInput ?? searchInputRecord?.searchInput,
            searchType: searchInputRecord?.type ?? 'Search',
            count: 10
        });

        const searchResp = result.data;
        const formattedSearchResp = searchResp?.web?.results?.map((item) => ({
            title: item?.title,
            description: item?.description,
            long_name: item?.profile?.long_name,
            img: item?.profile?.img,
            url: item?.url,
            thumbnail: item?.thumbnail?.src
        }));

        const { data } = await supabase
            .from('Chats')
            .insert([{
                libId,
                searchResult: formattedSearchResp,
                userSearchInput: userInput ?? searchInputRecord?.searchInput
            }])
            .select();

        await GetSearchRecords();
        setLoadingSearch(false);
        setUserInput('')
        await GenerateAIResp(formattedSearchResp, data[0].id);
    };
    // const GetSearchApiResult = async () => {
    //     setLoadingSearch(true);

    //     try {
    //         const result = await axios.post("/api/brave-search-api", {
    //             searchInput: userInput ?? searchInputRecord?.searchInput,
    //             searchType: searchInputRecord?.type ?? "Search",
    //             count: 10,
    //         });

    //         const searchResp = result.data;

    //         const formattedSearchResp = searchResp?.web?.results?.map((item) => ({
    //             title: item?.title,
    //             description: item?.description,
    //             long_name: item?.profile?.long_name,
    //             img: item?.profile?.img,
    //             url: item?.url,
    //             thumbnail: item?.thumbnail?.src,
    //         }));

    //         // Save in Supabase
    //         await supabase
    //             .from("Chats")
    //             .insert([
    //                 {
    //                     libId,
    //                     searchResult: formattedSearchResp,
    //                     userSearchInput: userInput ?? searchInputRecord?.searchInput,
    //                 },
    //             ])
    //             .select();

    //         await GetSearchRecords();
    //         setUserInput("");
    //     } catch (err) {
    //         if (err.response?.status === 429) {
    //             console.warn("Brave API rate limit hit");
    //             alert("⚠️ You’ve hit the Brave API rate limit. Please wait and try again.");
    //         } else {
    //             console.error("Search API error:", err);
    //             alert("Something went wrong while fetching search results.");
    //         }
    //     } finally {
    //         // Always stop loader
    //         setLoadingSearch(false);
    //     }
    // };


    const GenerateAIResp = async (formattedSearchResp, recordId) => {
        const result = await axios.post('/api/llm-model', {
            searchInput: userInput ?? searchInputRecord?.searchInput,
            searchResult: formattedSearchResp,
            recordId,
            model: aiModel
        });

        const { runId } = result.data;
        const interval = setInterval(async () => {
            const runResp = await axios.post('/api/get-inngest-status', { runId });
            if (runResp?.data?.data[0]?.status === 'Completed') {
                await GetSearchRecords();
                clearInterval(interval);
            }
        }, 1000);
    };

    const GetSearchRecords = async () => {
        let { data: Library } = await supabase
            .from('Library')
            .select('*,Chats(*)')
            .eq('libId', libId)
            .order('id', { foreignTable: 'Chats', ascending: true });

        setSearchResult(Library[0]);
    };

    function buildLibrary(searchResult) {
        return {
            title: searchResult?.searchInput || "My Library",
            libId: searchResult?.libId,
            created_at: searchResult?.created_at,
            items: (searchResult?.Chats || []).map(function (chat) {
                return {
                    id: chat.id,
                    role: "user",
                    content: chat.userSearchInput,
                    response: chat.aiResp,
                    created_at: chat.created_at
                };
            })
        };
    }

    const handleDeleteChat = async (chatId) => {
        try {
            // delete from supabase
            await supabase.from("Chats").delete().eq("id", chatId);

            // update local state
            setSearchResult((prev) => ({
                ...prev,
                Chats: prev.Chats.filter((c) => c.id !== chatId),
            }));
        } catch (error) {
            console.error("Error deleting chat:", error);
        }
    };

    return (
        <div className="relative pb-10 flex flex-col items-center">
            {/* top-right buttons */}
            <div className="fixed text-center z-30 flex items-center justify-center gap-2 right-2 top-2 md:right-5">
                {/* <LibraryHeaderActions library={library} /> */}
                <LibraryHeaderActions
                    library={library}
                    onTitleChange={handleLibraryTitleChange}
                />
            </div>

            {searchResult?.Chats?.map((chat, index) => (
                // <div key={index} className="pt-10">
                // <div key={index} className="pt-10 w-[90vw] sm:w-[80vw] md:w-[60vw]">
                <div key={index} className="pt-10 w-[90vw] sm:w-[88vw] md:w-[63vw]">
                    <h2 className="font-semibold text-4xl text-dark">{chat?.userSearchInput}</h2>

                    {/* tabs */}
                    <div className="flex items-center space-x-6 border-b border-theme pb-2 mt-6">
                        {tabs.map(({ label, icon: Icon, badge }) => (
                            <button
                                key={label}
                                onClick={() => setActiveTab(label)}
                                className={`flex items-center gap-1 relative text-[17px] md:text-sm font-medium text-muted hover:text-dark ${activeTab === label ? "text-dark" : ""}`}
                            >
                                <Icon className="h-5 w-5 md:w-4 md:h-4" />
                                <span>{label}</span>
                                {badge && (
                                    <span className="ml-1 text-xs bg-secondary text-muted px-1.5 py-0.5 rounded">
                                        {badge}
                                    </span>
                                )}
                                {activeTab === label && (
                                    <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-accent rounded"></span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* tab content */}
                    <div>
                        {activeTab === "Answer" ? (
                            <AnswerDisplay chat={chat} loadingSearch={loadingSearch} onDeleteChat={() => handleDeleteChat(chat.id)}
                                isDeletable={searchResult?.Chats?.length > 1} />
                        ) : activeTab === "Images" ? (
                            <ImageListTab chat={chat} loadingSearch={loadingSearch} />
                        ) : activeTab === "Sources" ? (
                            <SourceListTab chat={chat} loadingSearch={loadingSearch} />
                        ) : null}
                    </div>
                    <hr className="border-theme" />
                </div>
            ))}

            <ScrollToBottomButton />

            <div className="bg-secondary border border-theme rounded-lg shadow-md p-1 px-3 flex justify-between items-center fixed bottom-5 w-[90vw] sm:w-[88vw] md:w-[63vw]">
                <textarea
                    placeholder="Type Anything..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    rows={1}
                    className="flex-1 resize-none outline-none max-h-40 overflow-y-auto p-2 bg-transparent text-dark placeholder:text-muted"
                    onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            if (userInput?.length > 0 && !loadingSearch) {
                                GetSearchApiResult();
                            }
                        }
                    }}
                />

                <AudioRecorder onTranscriptChange={handleTranscriptChange} />

                {userInput?.length > 0 && (
                    <Button
                        onClick={GetSearchApiResult}
                        disabled={loadingSearch}
                        className="ml-2 flex-shrink-0 bg-accent h-8 w-8 md:h-7 md:w-7"
                    >
                        {loadingSearch ? (
                            <Loader2Icon className="text-white animate-spin" />
                        ) : (
                            <ArrowRight className="text-white" />
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default DisplayResult;







// // app/(routes)/search/[libId]/_components/DisplayResult.jsx
// import React, { useEffect, useState } from "react";
// import { ArrowRight, Link, Loader2Icon } from "lucide-react";
// import { LucideImage, LucideList, LucideSparkles, Send } from 'lucide-react';
// import AnswerDisplay from "./AnswerDisplay";
// import axios from "axios";
// import { supabase } from '../../../../../services/supabase';
// import { useParams } from "next/navigation";
// import ImageListTab from "./ImageListTab";
// import SourceListTab from "./SourceListTab";
// import { Button } from "../../../../../components/ui/button";
// import { useAiModel } from "../../../../../context/aiModelContext";
// import AudioRecorder from "@/app/_components/AudioRecorder";
// import LibraryHeaderActions from "./LibraryHeaderActions";
// import ScrollToBottomButton from "./ScrollToBottomButton";
// import { useRef } from "react";

// const tabs = [
//     { label: 'Answer', icon: LucideSparkles },
//     { label: 'Images', icon: LucideImage },
//     { label: 'Sources', icon: LucideList, Badge: 10 },
// ];

// function DisplayResult({ searchInputRecord }) {
//     const [activeTab, setActiveTab] = useState('Answer');
//     const [searchResult, setSearchResult] = useState('');
//     const { libId } = useParams();
//     const [loadingSearch, setLoadingSearch] = useState(false);
//     const [userInput, setUserInput] = useState();
//     const { aiModel } = useAiModel('');
//     const [library, setLibrary] = useState(buildLibrary(searchInputRecord));
//     const scrollRef = useRef();

//     const handleTranscriptChange = (transcript) => {
//         setUserInput((prev) => (prev ? prev + " " + transcript : transcript));
//     };

//     const handleLibraryTitleChange = (newTitle) => {
//         setLibrary(prev => ({ ...prev, title: newTitle }));
//     };

//     useEffect(() => {
//         searchInputRecord?.Chats?.length == 0 ? GetSearchApiResult() : GetSearchRecords();
//         setSearchResult(searchInputRecord);
//     }, [searchInputRecord]);

//     useEffect(() => {
//         setLibrary(buildLibrary(searchResult));
//     }, [searchResult]);

//     const GetSearchApiResult = async () => {
//         setLoadingSearch(true);
//         const result = await axios.post('/api/brave-search-api', {
//             searchInput: userInput ?? searchInputRecord?.searchInput,
//             searchType: searchInputRecord?.type ?? 'Search',
//             count: 10
//         });

//         const searchResp = result.data;
//         const formattedSearchResp = searchResp?.web?.results?.map((item) => ({
//             title: item?.title,
//             description: item?.description,
//             long_name: item?.profile?.long_name,
//             img: item?.profile?.img,
//             url: item?.url,
//             thumbnail: item?.thumbnail?.src
//         }));

//         const { data } = await supabase
//             .from('Chats')
//             .insert([{
//                 libId,
//                 searchResult: formattedSearchResp,
//                 userSearchInput: userInput ?? searchInputRecord?.searchInput
//             }])
//             .select();

//         await GetSearchRecords();
//         setLoadingSearch(false);
//         setUserInput('')
//         await GenerateAIResp(formattedSearchResp, data[0].id);
//     };

//     const GenerateAIResp = async (formattedSearchResp, recordId) => {
//         const result = await axios.post('/api/llm-model', {
//             searchInput: userInput ?? searchInputRecord?.searchInput,
//             searchResult: formattedSearchResp,
//             recordId,
//             model: aiModel
//         });

//         const { runId } = result.data;
//         const interval = setInterval(async () => {
//             const runResp = await axios.post('/api/get-inngest-status', { runId });
//             if (runResp?.data?.data[0]?.status === 'Completed') {
//                 await GetSearchRecords();
//                 clearInterval(interval);
//             }
//         }, 1000);
//     };

//     const GetSearchRecords = async () => {
//         let { data: Library } = await supabase
//             .from('Library')
//             .select('*,Chats(*)')
//             .eq('libId', libId)
//             .order('id', { foreignTable: 'Chats', ascending: true });

//         setSearchResult(Library[0]);
//     };

//     function buildLibrary(searchResult) {
//         return {
//             title: searchResult?.searchInput || "My Library",
//             libId: searchResult?.libId,
//             created_at: searchResult?.created_at,
//             items: (searchResult?.Chats || []).map(function (chat) {
//                 return {
//                     id: chat.id,
//                     role: "user",
//                     content: chat.userSearchInput,
//                     response: chat.aiResp,
//                     created_at: chat.created_at
//                 };
//             })
//         };
//     }

//     const handleDeleteChat = async (chatId) => {
//         try {
//             // delete from supabase
//             await supabase.from("Chats").delete().eq("id", chatId);

//             // update local state
//             setSearchResult((prev) => ({
//                 ...prev,
//                 Chats: prev.Chats.filter((c) => c.id !== chatId),
//             }));
//         } catch (error) {
//             console.error("Error deleting chat:", error);
//         }
//     };

//     return (
//         <div className="relative pb-10 flex flex-col items-center">
//             {/* top-right buttons */}
//             <div className="fixed text-center flex items-center justify-center gap-2 right-5 top-2 md:right-10">
//                 {/* <LibraryHeaderActions library={library} /> */}
//                 <LibraryHeaderActions
//                     library={library}
//                     onTitleChange={handleLibraryTitleChange}
//                 />
//             </div>

//             {searchResult?.Chats?.map((chat, index) => (
//                 <div key={index} className="mt-7">
//                     <h2 className="font-semibold text-4xl text-dark">{chat?.userSearchInput}</h2>

//                     {/* tabs */}
//                     <div className="flex items-center space-x-6 border-b border-theme pb-2 mt-6">
//                         {tabs.map(({ label, icon: Icon, badge }) => (
//                             <button
//                                 key={label}
//                                 onClick={() => setActiveTab(label)}
//                                 className={`flex items-center gap-1 relative text-sm font-medium text-muted hover:text-dark ${activeTab === label ? "text-dark" : ""}`}
//                             >
//                                 <Icon className="w-4 h-4" />
//                                 <span>{label}</span>
//                                 {badge && (
//                                     <span className="ml-1 text-xs bg-secondary text-muted px-1.5 py-0.5 rounded">
//                                         {badge}
//                                     </span>
//                                 )}
//                                 {activeTab === label && (
//                                     <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-accent rounded"></span>
//                                 )}
//                             </button>
//                         ))}
//                     </div>

//                     {/* tab content */}
//                     <div>
//                         {activeTab === "Answer" ? (
//                             <AnswerDisplay chat={chat} loadingSearch={loadingSearch} onDeleteChat={() => handleDeleteChat(chat.id)}
//                                 isDeletable={searchResult?.Chats?.length > 1} />
//                         ) : activeTab === "Images" ? (
//                             <ImageListTab chat={chat} loadingSearch={loadingSearch} />
//                         ) : activeTab === "Sources" ? (
//                             <SourceListTab chat={chat} loadingSearch={loadingSearch} />
//                         ) : null}
//                     </div>
//                     <hr className="my-5 border-theme" />
//                 </div>
//             ))}

//             <ScrollToBottomButton />

//             <div className="bg-secondary border border-theme rounded-lg shadow-md p-1 px-3 flex justify-between items-center fixed bottom-5 w-[88vw] sm:w-[88vw] md:w-[63vw]">
//                 <textarea
//                     placeholder="Type Anything..."
//                     value={userInput}
//                     onChange={(e) => setUserInput(e.target.value)}
//                     rows={1}
//                     className="flex-1 resize-none outline-none max-h-40 overflow-y-auto p-2 bg-transparent text-dark placeholder:text-muted"
//                     onInput={(e) => {
//                         e.target.style.height = "auto";
//                         e.target.style.height = `${e.target.scrollHeight}px`;
//                     }}
//                     onKeyDown={(e) => {
//                         if (e.key === "Enter" && !e.shiftKey) {
//                             e.preventDefault();
//                             if (userInput?.length > 0 && !loadingSearch) {
//                                 GetSearchApiResult();
//                             }
//                         }
//                     }}
//                 />

//                 <AudioRecorder onTranscriptChange={handleTranscriptChange} />

//                 {userInput?.length > 0 && (
//                     <Button
//                         onClick={GetSearchApiResult}
//                         disabled={loadingSearch}
//                         className="ml-2 flex-shrink-0 bg-accent h-7 w-7"
//                     >
//                         {loadingSearch ? (
//                             <Loader2Icon className="text-white animate-spin" />
//                         ) : (
//                             <ArrowRight className="text-white" />
//                         )}
//                     </Button>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default DisplayResult;
