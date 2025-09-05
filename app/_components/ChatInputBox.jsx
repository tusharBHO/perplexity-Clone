"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { SearchCheck, Atom, Cpu, AudioLines, ArrowRight, Loader2Icon, Send } from 'lucide-react'
import { Button } from "../../components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { supabase } from '../../services/supabase';
import { useUser } from '@clerk/nextjs'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
import { useSearchType } from '../../context/SearchTypeContext'
import AudioRecorder from './AudioRecorder'
import FileUploadButton from "./FileUploadButton";
import { useAiModel } from '../../context/aiModelContext';
import ThemeToggle from './ThemeToggle'

const AIModelsOption = [
    { id: 1, name: 'gemini-1.5-flash', desc: 'Free-tier Gemini model (Google)', provider: 'gemini' },
    { id: 2, name: 'gemini-2.0-flash', desc: 'Advanced Gemini model (Google)', provider: 'gemini' },
    { id: 3, name: 'gemini-2.5-flash', desc: 'Advanced Gemini model (Google)', provider: 'gemini' },
];

function ChatInputBox() {
    const [userSearchInput, setUserSearchInput] = useState('');
    const { searchType, setSearchType } = useSearchType('');
    const { user } = useUser();
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const { aiModel, setAiModel } = useAiModel('');

    const handleTranscriptChange = (transcript) => {
        setUserSearchInput((prev) => (prev ? prev + " " + transcript : transcript));
    };

    const onSearchQuery = async () => {
        setLoading(true)
        const libId = uuidv4();

        const { data } = await supabase.from('Library').insert([
            {
                searchInput: userSearchInput,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                type: searchType,
                libId: libId
            }
        ]).select();

        setLoading(false)
        setUserSearchInput('');
        router.push('/search/' + libId)
    }

    return (
        <div className="md:ml-14 h-screen w-full md:w-[calc(100%-3.5rem)] flex flex-col items-center justify-start pt-[25vh]  bg-primary">
            {/* Logo + Title */}
            <div className="flex items-center justify-center text-center gap-3 mb-8">
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="animate-spin-slow h-10 w-10 dark:invert"
                />
                <span className="text-3xl font-semibold text-dark">
                    curiosity
                </span>
                {/* <ThemeToggle /> */}
            </div>

            {/* Search Box */}
            <div className="p-2 w-[90vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] border border-theme rounded-2xl bg-primary shadow-md transition-colors duration-300">
                <Tabs value={searchType} onValueChange={setSearchType} className="w-full">

                    {/* Search Tab */}
                    <TabsContent value="Search">
                        <textarea
                            placeholder="Search Anything"
                            value={userSearchInput}
                            onChange={(e) => setUserSearchInput(e.target.value)}
                            rows={1}
                            className="w-full p-4 outline-none resize-none overflow-auto max-h-[16rem] bg-transparent text-dark placeholder-gray-400
                             transition-colors duration-300"
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();  // Prevent newline on Enter without Shift
                                    // Trigger your search function here, e.g. onSearchQuery()
                                    if (userSearchInput) {
                                        onSearchQuery();
                                    }
                                }
                                // Else allow Shift+Enter to insert a newline naturally
                            }}
                        />
                    </TabsContent>

                    {/* Research Tab */}
                    <TabsContent value="Research">
                        <textarea
                            placeholder="Research Anything"
                            value={userSearchInput}
                            onChange={(e) => setUserSearchInput(e.target.value)}
                            rows={1}
                            className="w-full p-4 outline-none resize-none overflow-auto max-h-[16rem] bg-transparent text-dark placeholder-gray-400
                             transition-colors duration-300"
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();  // Prevent newline on Enter without Shift
                                    // Trigger your search function here, e.g. onSearchQuery()
                                    if (userSearchInput) {
                                        onSearchQuery();
                                    }
                                }
                                // Else allow Shift+Enter to insert a newline naturally
                            }}
                        />
                    </TabsContent>

                    {/* Tabs List */}
                    <TabsList
                        aria-label="Search type options"
                        className="flex justify-between items-center mt-2 mx-auto w-full bg-primary"
                    >
                        <div className="flex rounded-lg overflow-hidden bg-blue-100 dark:bg-black/20">
                            <TabsTrigger
                                value="Search"
                                className={`px-2 py-1 transition-colors duration-300 ${searchType === 'Search'
                                    ? 'bg-accent text-white' : 'text-muted bg-pHover-hover'}`}
                            >
                                <SearchCheck className="inline-block" />
                                <span className="hidden sm:inline">Search</span>
                            </TabsTrigger>

                            <TabsTrigger
                                value="Research"
                                className={`px-2 py-1 transition-colors duration-300 ${searchType === 'Research'
                                    ? 'bg-accent text-white' : 'text-muted bg-pHover-hover'}`}
                            >
                                <Atom className="inline-block" />
                                <span className="hidden sm:inline">Research</span>
                            </TabsTrigger>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-center gap-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger aria-label="Select AI model">
                                    <Cpu className="text-gray-500 bg-sHover-hover rounded-sm p-2 h-8 w-8 cursor-pointer transition-colors duration-300" />
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="w-56 bg-secondary border border-theme text-dark rounded-lg shadow-lg transition-colors duration-300">
                                    {AIModelsOption.map((model, index) => {
                                        const isSelected = aiModel === model.name;
                                        return (
                                            <DropdownMenuItem
                                                key={index}
                                                onClick={() => setAiModel(model.name)}
                                                className={`flex flex-col gap-1 py-2 px-3 rounded-lg cursor-pointer transition-colors duration-300 ${isSelected
                                                    ? 'bg-accent text-white' : 'hover:bg-accent hover:text-dark text-muted'}`}
                                            >
                                                <div className="flex justify-between w-full items-center">
                                                    <h2 className="text-sm font-medium">{model.name}</h2>
                                                    {isSelected && <span className="text-xs">✔</span>}
                                                </div>
                                                {model.desc && <p className="text-xs text-muted">{model.desc}</p>}
                                            </DropdownMenuItem>
                                        );
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <FileUploadButton onFileSelect={(file) => console.log(file)} />
                            <AudioRecorder onTranscriptChange={handleTranscriptChange} />

                            <Button
                                onClick={() => { userSearchInput && onSearchQuery() }}
                                disabled={loading}
                                className="bg-accent hover:brightness-110 text-white h-7 w-7 p-0 flex items-center justify-center rounded-sm transition-all duration-300 flex-shrink-0"
                            >
                                {loading ? <Loader2Icon /> : <ArrowRight />}
                            </Button>
                        </div>
                    </TabsList>
                </Tabs>
            </div>
        </div>

    )
}

export default ChatInputBox