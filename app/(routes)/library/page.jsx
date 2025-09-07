"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../services/supabase'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { SquareArrowOutUpRight, Clock, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import LibrarySkeleton from './LibrarySkeleton'  // ✅ Import your skeleton

function Library() {
    const { user } = useUser()
    const [libraryHistory, setLibraryHistory] = useState([])
    const [isLoading, setIsLoading] = useState(true)  // ✅ Track loading state
    const router = useRouter()

    useEffect(() => {
        if (user) GetLibraryHistory()
    }, [user])

    const GetLibraryHistory = async () => {
        let { data: Library, error } = await supabase
            .from('Library')
            .select('*')
            .eq('userEmail', user?.primaryEmailAddress?.emailAddress)
            .order('id', { ascending: false })

        if (!error) setLibraryHistory(Library || [])
        setIsLoading(false)  // ✅ Loading complete
    }

    const handleDelete = async (libId) => {
        const { error } = await supabase
            .from('Library')
            .delete()
            .eq('libId', libId)

        if (!error) {
            setLibraryHistory((prev) =>
                prev.filter((item) => item.libId !== libId)
            )
        }
    }

    return (
        <div className="px-6 md:px-16 lg:px-32 xl:px-48 pt-16 pb-6 md:ml-14 h-screen w-full md:w-[calc(100%-3.5rem)] bg-primary">
            <h2 className="font-bold text-3xl text-dark">📚 Library</h2>
            <p className="text-muted mt-2 text-sm">
                Your saved searches & history
            </p>

            <div className="mt-5 h-[77vh] overflow-y-scroll">
                {isLoading ? (
                    <LibrarySkeleton items={5} />  // ✅ Show skeleton while loading
                ) : libraryHistory.length > 0 ? (
                    libraryHistory.map((item, index) => (
                        <div
                            key={index}
                            className="group rounded-xl border border-theme bg-secondary p-4 mb-4 flex justify-between items-center hover:shadow-md transition"
                        >
                            <div
                                className="cursor-pointer"
                                onClick={() => router.push('/search/' + item.libId)}
                            >
                                <h2 className="font-semibold text-dark group-hover:text-accent">
                                    {item.searchInput}
                                </h2>
                                <p className="flex items-center gap-1 text-xs text-muted mt-1">
                                    <Clock className="h-3 w-3" />
                                    {moment(item.created_at).fromNow()}
                                </p>
                            </div>

                            <div className="flex items-center justify-center gap-5">
                                <Trash2
                                    onClick={() => handleDelete(item.libId)}
                                    className="h-5 w-5 md:h-4 md:w-4 text-muted hover:text-red-500 cursor-pointer"
                                />
                                <SquareArrowOutUpRight
                                    onClick={() => router.push('/search/' + item.libId)}
                                    className="h-5 w-5 text-muted hover:text-dark cursor-pointer"
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center mt-20">
                        <div className="w-20 h-20 mx-auto bg-border flex items-center justify-center rounded-full">
                            <Clock className="h-10 w-10 text-muted" />
                        </div>
                        <h3 className="mt-4 font-medium text-dark text-lg">
                            No history yet
                        </h3>
                        <p className="text-muted text-sm">
                            Your searches will appear here once you start exploring.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Library











// "use client"
// import React, { useEffect, useState } from 'react'
// import { supabase } from '../../../services/supabase'
// import { useUser } from '@clerk/nextjs'
// import moment from 'moment'
// import { SquareArrowOutUpRight, Clock, Trash2 } from 'lucide-react'
// import { useRouter } from 'next/navigation'

// function Library() {
//     const { user } = useUser()
//     const [libraryHistory, setLibraryHistory] = useState([])
//     const router = useRouter()

//     useEffect(() => {
//         if (user) GetLibraryHistory()
//     }, [user])

//     // Fetch library history from Supabase
//     const GetLibraryHistory = async () => {
//         let { data: Library, error } = await supabase
//             .from('Library')
//             .select('*')
//             .eq('userEmail', user?.primaryEmailAddress?.emailAddress)
//             .order('id', { ascending: false })

//         if (!error) setLibraryHistory(Library || [])
//     }

//     // Delete item from Supabase & update UI
//     const handleDelete = async (libId) => {
//         const { error } = await supabase
//             .from('Library')
//             .delete()
//             .eq('libId', libId)

//         if (!error) {
//             setLibraryHistory((prev) =>
//                 prev.filter((item) => item.libId !== libId)
//             )
//         }
//     }

//     return (
//         <div className="px-6 md:px-16 lg:px-32 xl:px-48 pt-16 pb-6 md:ml-14 h-screen w-full md:w-[calc(100%-3.5rem)] bg-primary">
//             {/* Page header */}
//             <h2 className="font-bold text-3xl text-dark">📚 Library</h2>
//             <p className="text-muted mt-2 text-sm">
//                 Your saved searches & history
//             </p>

//             {/* History List */}
//             <div className="mt-5 h-[78vh] overflow-y-scroll">
//                 {libraryHistory.length > 0 ? (
//                     libraryHistory.map((item, index) => (
//                         <div
//                             key={index}
//                             className="group rounded-xl border border-theme bg-secondary p-4 mb-4 flex justify-between items-center hover:shadow-md transition"
//                         >
//                             {/* Left side */}
//                             <div
//                                 className="cursor-pointer"
//                                 onClick={() => router.push('/search/' + item.libId)}
//                             >
//                                 <h2 className="font-semibold text-dark group-hover:text-accent">
//                                     {item.searchInput}
//                                 </h2>
//                                 <p className="flex items-center gap-1 text-xs text-muted mt-1">
//                                     <Clock className="h-3 w-3" />
//                                     {moment(item.created_at).fromNow()}
//                                 </p>
//                             </div>

//                             {/* Right side */}
//                             <div className="flex items-center justify-center gap-5">
//                                 <Trash2
//                                     onClick={() => handleDelete(item.libId)}
//                                     className="h-5 w-5 md:h-4 md:w-4 text-muted hover:text-red-500 cursor-pointer"
//                                 />
//                                 <SquareArrowOutUpRight
//                                     onClick={() => router.push('/search/' + item.libId)}
//                                     className="h-5 w-5 text-muted hover:text-dark cursor-pointer"
//                                 />
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     // Empty State
//                     <div className="text-center mt-20">
//                         <div className="w-20 h-20 mx-auto bg-border flex items-center justify-center rounded-full">
//                             <Clock className="h-10 w-10 text-muted" />
//                         </div>
//                         <h3 className="mt-4 font-medium text-dark text-lg">
//                             No history yet
//                         </h3>
//                         <p className="text-muted text-sm">
//                             Your searches will appear here once you start exploring.
//                         </p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }

// export default Library