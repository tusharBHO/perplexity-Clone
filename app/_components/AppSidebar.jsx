// app/_components/AppSidebar.jsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
    Compass, GalleryHorizontalEnd, Search,
    Trash2, SearchCheck, Atom, Cpu,
    DollarSign, Palette, Star, Volleyball,
    Menu, X,
    ArrowUpLeftFromSquareIcon,
    ArrowLeft
} from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useSearchType } from "../../context/SearchTypeContext";
import { useSearchCategory } from "../../context/searchCategoryContext";
import { supabase } from "../../services/supabase";
import CustomUserMenu from "./CustomUserMenu";
import ThemeToggle from "./ThemeToggle";

const MenuOptions = [
    {
        title: "Home",
        icon: Search,
        path: "/",
        submenu: [
            { icon: <SearchCheck className="h-4 w-4" />, label: "Search" },
            { icon: <Atom className="h-4 w-4" />, label: "Research" },
        ],
    },
    {
        title: "Discover",
        icon: Compass,
        path: "/discover",
        submenu: [
            { icon: <Star className="h-4 w-4" />, label: "Top" },
            { icon: <Cpu className="h-4 w-4" />, label: "Tech & Science" },
            { icon: <DollarSign className="h-4 w-4" />, label: "Finance" },
            { icon: <Palette className="h-4 w-4" />, label: "Art & Culture" },
            { icon: <Volleyball className="h-4 w-4" />, label: "Sports" },
        ],
    },
    {
        title: "Library",
        icon: GalleryHorizontalEnd,
        path: "/library",
    },
];

export default function AppSidebar() {
    const path = usePathname();
    const router = useRouter();
    const { user } = useUser();

    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const { setSearchType } = useSearchType("");
    const { setSearchCategory } = useSearchCategory("");
    const [libraryItems, setLibraryItems] = useState([]);
    const [libIdsArray, setLibIdsArray] = useState([]);
    const [searchInputsArray, setSearchInputsArray] = useState([]);
    const leaveTimeoutRef = useRef(null);

    // Hover handling (desktop only)
    const handleMouseEnter = (idx) => {
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
            leaveTimeoutRef.current = null;
        }
        setHoveredIdx(idx);
    };
    const handleMouseLeave = () => {
        leaveTimeoutRef.current = setTimeout(() => {
            setHoveredIdx(null);
        }, 200);
    };

    useEffect(() => {
        return () => {
            if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        const fetchLibraryItems = async () => {
            if (!user) return;
            const { data, error } = await supabase
                .from("Library")
                .select("searchInput, libId")
                .eq("userEmail", user?.primaryEmailAddress.emailAddress)
                .order('id', { ascending: false })

            if (error) {
                console.error("Error fetching library:", error.message);
                return;
            }
            setLibraryItems(data || []);
            setLibIdsArray(data?.map((item) => item.libId) || []);
            setSearchInputsArray(data?.map((item) => item.searchInput) || []);
        };
        fetchLibraryItems();
    }, [user]);

    const handleMenuClick = (item, index) => {
        if (item === "Search" || item === "Research") {
            setSearchType(item);
            router.push("/");
        } else if (
            ["Top", "Tech & Science", "Finance", "Art & Culture", "Sports"].includes(item)
        ) {
            setSearchCategory(item);
            router.push("/discover");
        } else {
            router.push(`/search/${libIdsArray[index]}`);
        }

        setHoveredIdx(null);
        setIsMobileOpen(false); // also close on mobile
    };

    const handleDeleteLibraryItem = async (libId) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from("Library")
                .delete()
                .eq("libId", libId)
                .eq("userEmail", user?.primaryEmailAddress.emailAddress);

            if (error) {
                console.error("Error deleting library item:", error.message);
                return;
            }

            // Update UI state
            setLibraryItems((prev) => prev.filter((item) => item.libId !== libId));
            setLibIdsArray((prev) => prev.filter((id) => id !== libId));
            setSearchInputsArray((prev, i) =>
                prev.filter((_, index) => libIdsArray[index] !== libId)
            );

            // 🟢 Redirect if user deleted the currently opened library
            if (path === `/search/${libId}`) {
                router.push("/"); // or "/new-chat" if that's what you want
            }
        } catch (err) {
            console.error("Unexpected error deleting item:", err);
        }
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed top-0 left-0 h-full w-14 flex-col items-center 
                   bg-secondary border-r border-theme shadow-lg z-50 select-none">
                {/* Logo */}
                <div className="mb-10 mt-2">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={32}
                        height={32}
                        className="animate-spin-slow dark:invert"
                    />
                </div>

                <ThemeToggle />

                {/* Menu */}
                <nav className="flex flex-col gap-2 flex-grow">
                    {MenuOptions
                        .filter(menu => user ? true : menu.title !== "Library")
                        .map((menu, idx) => {
                            const isActive =
                                menu.path === "/" ? path === "/" : path?.startsWith(menu.path);

                            return (
                                <div
                                    key={idx}
                                    className="relative flex flex-col items-center mb-1"
                                    onMouseEnter={() => handleMouseEnter(idx)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <button
                                        onClick={() => router.push(menu.path)}
                                        className={`p-1.5 group relative flex flex-col items-center cursor-pointer transition-all duration-300 
                            ${isActive ? "text-accent" : "text-muted"} bg-sHover-hover rounded-sm`}
                                    >
                                        <menu.icon className="h-5 w-5 group-hover:scale-110 hover:text-accent transition-transform duration-300" />
                                        {isActive && (
                                            <span className="absolute -left-0 w-1 h-5 bg-accent rounded-r-full"></span>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                </nav>

                {/* Footer User Button */}
                <footer className="h-10 w-10 mt-auto flex justify-center py-0 mb-0">
                    <CustomUserMenu />
                </footer>
            </aside>

            {/* Mobile Header with Hamburger */}
            {/* <div className="md:hidden fixed top-0 left-0 w-full flex items-center justify-between z-10 p-2 bg-secondary border-b border-theme"> */}
            <div className="md:hidden fixed top-0 left-0 w-full flex items-center justify-between z-10 p-2 bg-secondary border-b border-theme">
                <button onClick={() => setIsMobileOpen(!isMobileOpen)}>
                    <Menu className="h-6 w-6 text-dark" />
                </button>
            </div>

            {/* Mobile Sidebar Drawer */}
            {isMobileOpen && (
                <div className="md:hidden fixed top-0 left-0 flex flex-col h-screen max-h-[100vh] w-78 bg-secondary z-50 px-1 animate-[slideIn_0.3s_ease-out] border-r border-theme">
                    <div>
                        <button onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2 text-dark">
                            {/* <X className="h-5 w-5 text-dark" /> */}
                            <ArrowLeft className="h-5 w-5 text-dark" />Back
                        </button>
                    </div>

                    <nav className="flex flex-col h-full">
                        {MenuOptions.map((menu, idx) => {
                            const isActiveRoute = menu.path === "/"
                                ? path === "/"
                                : path?.startsWith(menu.path);

                            return (
                                <div key={idx}>
                                    {/* Main Button */}
                                    <button
                                        onClick={() => router.push(menu.path)}
                                        className={`flex items-center gap-2 text-xl font-medium w-full text-left py-0 px-0 rounded hover:bg-secondary 
                                        ${isActiveRoute ? "text-accent" : "text-dark"}`}
                                    >
                                        <menu.icon className="h-6 w-6" />
                                        {menu.title}
                                    </button>

                                    {/* Submenu (for Home & Discover) */}
                                    {menu.title !== "Library" && menu.submenu && (
                                        <ul
                                            className={`ml-8 mt-1 mb-3 space-y-1`}
                                        >
                                            {menu.submenu.map((item, i) => (
                                                <li
                                                    key={i}
                                                    className="text-[17px] cursor-pointer text-muted hover:text-accent"
                                                    onClick={() => handleMenuClick(item.label, i)}
                                                >
                                                    {item.label}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Library Items */}
                                    {menu.title === "Library" && (
                                        // <div className="w-full pr-1 h-[calc(100vh-390px)] overflow-y-scroll overflow-x-hidden">
                                        <div className="w-full pr-1 mb-3 h-[calc(100vh-400px)] overflow-y-scroll overflow-x-hidden">
                                            {searchInputsArray.map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="ml-8 flex items-center justify-between gap-2 px-0 py-1 rounded-md 
                            transition-all duration-200 cursor-pointer hover:bg-secondary"
                                                >
                                                    <li
                                                        className="text-[17px] cursor-pointer list-none text-muted truncate"
                                                        onClick={() => handleMenuClick(item, i)}
                                                    >
                                                        {item}
                                                    </li>
                                                    <Trash2
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteLibraryItem(libIdsArray[i]);
                                                        }}
                                                        className="h-4 w-4 md:h-3 md:w-3 text-muted cursor-pointer hover:scale-110 transition-transform"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <div className="h-[40px] w-full px-0 flex items-center justify-start gap-2">
                            <CustomUserMenu />
                            <p className="font-medium text-dark text-lg">{user?.fullName}</p>
                        </div>
                    </nav>

                    {/* <div className="fixed -bottom-1 sm:bottom-2">
                        <CustomUserMenu />
                    </div> */}
                </div>
            )}

            {/* Hover Panel (desktop only) */}
            {hoveredIdx !== null && (
                <div
                    onMouseEnter={() => {
                        if (leaveTimeoutRef.current) {
                            clearTimeout(leaveTimeoutRef.current);
                            leaveTimeoutRef.current = null;
                        }
                        setHoveredIdx(hoveredIdx);
                    }}
                    onMouseLeave={handleMouseLeave}
                    className="hidden md:block fixed top-0 left-14 h-screen w-60 bg-secondary backdrop-blur-xl border-l border-theme shadow-2xl 
                     p-2 z-40 animate-[slideIn_0.2s_ease-out]"
                >
                    <h4 className="text-sm text-accent font-semibold mb-3">
                        {MenuOptions[hoveredIdx].title}
                    </h4>
                    <hr className="mb-3 border-theme" />

                    <ul className="space-y-1">
                        {MenuOptions[hoveredIdx].title !== "Library" &&
                            MenuOptions[hoveredIdx].submenu?.map((item, i) => (
                                <li
                                    key={i}
                                    className="text-xs cursor-pointer text-muted bg-sHover-hover flex items-center gap-2 px-1.5 py-1 rounded-sm transition-all duration-200"
                                    onClick={() => handleMenuClick(item.label, i)}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </li>
                            ))}

                        {MenuOptions[hoveredIdx].title === "Library" && (
                            <div className="h-[calc(100vh-65px)] overflow-y-auto overflow-x-hidden">
                                {searchInputsArray.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between group py-1 px-1.5 rounded-sm 
                                    bg-sHover-hover transition-all duration-200 cursor-pointer"
                                        onClick={() => handleMenuClick(item, i)}
                                    >
                                        <li className="text-xs text-dark group-hover:text-accent truncate">
                                            {item}
                                        </li>
                                        <Trash2
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteLibraryItem(libIdsArray[i]);
                                            }}
                                            className="h-4 w-4 text-muted opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </ul>
                </div>
            )}
        </>
    );
}











// // app/_components/AppSidebar.jsx
// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import {
//     Compass, GalleryHorizontalEnd, Search,
//     Trash2, SearchCheck, Atom, Cpu,
//     DollarSign, Palette, Star, Volleyball,
//     Menu, X
// } from "lucide-react";

// import { usePathname, useRouter } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
// import { useSearchType } from "../../context/SearchTypeContext";
// import { useSearchCategory } from "../../context/searchCategoryContext";
// import { supabase } from "../../services/supabase";
// import CustomUserMenu from "./CustomUserMenu";
// import ThemeToggle from "./ThemeToggle";

// const MenuOptions = [
//     {
//         title: "Home",
//         icon: Search,
//         path: "/",
//         submenu: [
//             { icon: <SearchCheck className="h-4 w-4" />, label: "Search" },
//             { icon: <Atom className="h-4 w-4" />, label: "Research" },
//         ],
//     },
//     {
//         title: "Discover",
//         icon: Compass,
//         path: "/discover",
//         submenu: [
//             { icon: <Star className="h-4 w-4" />, label: "Top" },
//             { icon: <Cpu className="h-4 w-4" />, label: "Tech & Science" },
//             { icon: <DollarSign className="h-4 w-4" />, label: "Finance" },
//             { icon: <Palette className="h-4 w-4" />, label: "Art & Culture" },
//             { icon: <Volleyball className="h-4 w-4" />, label: "Sports" },
//         ],
//     },
//     {
//         title: "Library",
//         icon: GalleryHorizontalEnd,
//         path: "/library",
//     },
// ];

// export default function AppSidebar() {
//     const path = usePathname();
//     const router = useRouter();
//     const { user } = useUser();

//     const [hoveredIdx, setHoveredIdx] = useState(null);
//     const [isMobileOpen, setIsMobileOpen] = useState(false);

//     const { setSearchType } = useSearchType("");
//     const { setSearchCategory } = useSearchCategory("");
//     const [libraryItems, setLibraryItems] = useState([]);
//     const [libIdsArray, setLibIdsArray] = useState([]);
//     const [searchInputsArray, setSearchInputsArray] = useState([]);
//     const leaveTimeoutRef = useRef(null);

//     // Hover handling (desktop only)
//     const handleMouseEnter = (idx) => {
//         if (leaveTimeoutRef.current) {
//             clearTimeout(leaveTimeoutRef.current);
//             leaveTimeoutRef.current = null;
//         }
//         setHoveredIdx(idx);
//     };
//     const handleMouseLeave = () => {
//         leaveTimeoutRef.current = setTimeout(() => {
//             setHoveredIdx(null);
//         }, 200);
//     };

//     useEffect(() => {
//         return () => {
//             if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
//         };
//     }, []);

//     useEffect(() => {
//         const fetchLibraryItems = async () => {
//             if (!user) return;
//             const { data, error } = await supabase
//                 .from("Library")
//                 .select("searchInput, libId")
//                 .eq("userEmail", user?.primaryEmailAddress.emailAddress)
//                 .order('id', { ascending: false })

//             if (error) {
//                 console.error("Error fetching library:", error.message);
//                 return;
//             }
//             setLibraryItems(data || []);
//             setLibIdsArray(data?.map((item) => item.libId) || []);
//             setSearchInputsArray(data?.map((item) => item.searchInput) || []);
//         };
//         fetchLibraryItems();
//     }, [user]);

//     const handleMenuClick = (item, index) => {
//         if (item === "Search" || item === "Research") {
//             setSearchType(item);
//             router.push("/");
//         } else if (
//             ["Top", "Tech & Science", "Finance", "Art & Culture", "Sports"].includes(item)
//         ) {
//             setSearchCategory(item);
//             router.push("/discover");
//         } else {
//             router.push(`/search/${libIdsArray[index]}`);
//         }

//         setHoveredIdx(null);
//         setIsMobileOpen(false); // also close on mobile
//     };

//     const handleDeleteLibraryItem = async (libId) => {
//         if (!user) return;

//         try {
//             const { error } = await supabase
//                 .from("Library")
//                 .delete()
//                 .eq("libId", libId)
//                 .eq("userEmail", user?.primaryEmailAddress.emailAddress);

//             if (error) {
//                 console.error("Error deleting library item:", error.message);
//                 return;
//             }

//             // Update UI state
//             setLibraryItems((prev) => prev.filter((item) => item.libId !== libId));
//             setLibIdsArray((prev) => prev.filter((id) => id !== libId));
//             setSearchInputsArray((prev, i) =>
//                 prev.filter((_, index) => libIdsArray[index] !== libId)
//             );

//             // 🟢 Redirect if user deleted the currently opened library
//             if (path === `/search/${libId}`) {
//                 router.push("/"); // or "/new-chat" if that's what you want
//             }
//         } catch (err) {
//             console.error("Unexpected error deleting item:", err);
//         }
//     };

//     return (
//         <>
//             {/* Desktop Sidebar */}
//             <aside className="hidden md:flex fixed top-0 left-0 h-full w-14 flex-col items-center
//                    bg-secondary border-r border-theme shadow-lg z-50 select-none">
//                 {/* Logo */}
//                 <div className="mb-10 mt-2">
//                     <Image
//                         src="/logo.png"
//                         alt="Logo"
//                         width={32}
//                         height={32}
//                         className="animate-spin-slow dark:invert"
//                     />
//                 </div>

//                 <ThemeToggle />

//                 {/* Menu */}
//                 <nav className="flex flex-col gap-2 flex-grow">
//                     {MenuOptions
//                         .filter(menu => user ? true : menu.title !== "Library")
//                         .map((menu, idx) => {
//                             const isActive =
//                                 menu.path === "/" ? path === "/" : path?.startsWith(menu.path);

//                             return (
//                                 <div
//                                     key={idx}
//                                     className="relative flex flex-col items-center mb-1"
//                                     onMouseEnter={() => handleMouseEnter(idx)}
//                                     onMouseLeave={handleMouseLeave}
//                                 >
//                                     <button
//                                         onClick={() => router.push(menu.path)}
//                                         className={`p-1.5 group relative flex flex-col items-center cursor-pointer transition-all duration-300
//                             ${isActive ? "text-accent" : "text-muted"} bg-sHover-hover rounded-sm`}
//                                     >
//                                         <menu.icon className="h-5 w-5 group-hover:scale-110 hover:text-accent transition-transform duration-300" />
//                                         {isActive && (
//                                             <span className="absolute -left-0 w-1 h-5 bg-accent rounded-r-full"></span>
//                                         )}
//                                     </button>
//                                 </div>
//                             );
//                         })}
//                 </nav>

//                 {/* Footer User Button */}
//                 <footer className="h-10 w-10 mt-auto flex justify-center py-0 mb-0">
//                     <CustomUserMenu />
//                 </footer>
//             </aside>

//             {/* Mobile Header with Hamburger */}
//             <div className="md:hidden fixed top-0 left-0 w-full flex items-center justify-between z-50 p-2 bg-secondary border-b border-theme">
//                 <button onClick={() => setIsMobileOpen(!isMobileOpen)}>
//                     <Menu className="h-5 w-5 text-dark" />
//                 </button>
//             </div>

//             {/* Mobile Sidebar Drawer */}
//             {isMobileOpen && (
//                 <div className="md:hidden fixed top-0 left-0 flex flex-col min-h-0 h-screen w-64 bg-secondary z-50 p-1 animate-[slideIn_0.3s_ease-out] border-r border-theme">
//                     <div className="flex items-center gap-2 text-dark">
//                         <button onClick={() => setIsMobileOpen(false)}>
//                             <X className="h-5 w-5 text-dark" />
//                         </button>
//                         <span>Back</span>
//                     </div>

//                     <nav className="flex flex-col min-h-0 h-full gap-4">
//                         {MenuOptions.map((menu, idx) => {
//                             const isActiveRoute = menu.path === "/"
//                                 ? path === "/"
//                                 : path?.startsWith(menu.path);

//                             return (
//                                 <div key={idx}>
//                                     {/* Main Button */}
//                                     <button
//                                         onClick={() => router.push(menu.path)}
//                                         className={`flex items-center gap-2 text-base font-medium w-full text-left py-0 px-0 rounded hover:bg-secondary
//                 ${isActiveRoute ? "text-accent" : "text-dark"}`}
//                                     >
//                                         <menu.icon className="h-5 w-5" />
//                                         {menu.title}
//                                     </button>

//                                     {/* Submenu (for Home & Discover) */}
//                                     {menu.title !== "Library" && menu.submenu && (
//                                         <ul
//                                             className={`${menu.title === "Home" ? "h-8" : ""}
//                                ${menu.title === "Discover" ? "h-24" : ""}
//                                ml-8 mt-1 space-y-1`}
//                                         >
//                                             {menu.submenu.map((item, i) => (
//                                                 <li
//                                                     key={i}
//                                                     className="text-xs cursor-pointer text-muted hover:text-accent"
//                                                     onClick={() => handleMenuClick(item.label, i)}
//                                                 >
//                                                     {item.label}
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     )}

//                                     {/* Library Items */}
//                                     {menu.title === "Library" && (
//                                         <div className="w-full pr-1 h-[calc(100vh-310px)] overflow-y-scroll overflow-x-hidden">
//                                             {searchInputsArray.map((item, i) => (
//                                                 <div
//                                                     key={i}
//                                                     className="ml-8 flex items-center justify-between gap-2 px-0 py-1 rounded-md
//                             transition-all duration-200 cursor-pointer hover:bg-secondary"
//                                                 >
//                                                     <li
//                                                         className="text-xs cursor-pointer list-none text-dark truncate"
//                                                         onClick={() => handleMenuClick(item, i)}
//                                                     >
//                                                         {item}
//                                                     </li>
//                                                     <Trash2
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             handleDeleteLibraryItem(libIdsArray[i]);
//                                                         }}
//                                                         className="h-3 w-3 text-muted cursor-pointer hover:scale-110 transition-transform"
//                                                     />
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             );
//                         })}

//                     </nav>

//                     <div className="h-8 w-8 fixed bottom-2">
//                         <CustomUserMenu />
//                     </div>
//                 </div>
//             )}

//             {/* Hover Panel (desktop only) */}
//             {hoveredIdx !== null && (
//                 <div
//                     onMouseEnter={() => {
//                         if (leaveTimeoutRef.current) {
//                             clearTimeout(leaveTimeoutRef.current);
//                             leaveTimeoutRef.current = null;
//                         }
//                         setHoveredIdx(hoveredIdx);
//                     }}
//                     onMouseLeave={handleMouseLeave}
//                     className="hidden md:block fixed top-0 left-14 h-screen w-60 bg-secondary backdrop-blur-xl border-l border-theme shadow-2xl
//                      p-2 z-40 animate-[slideIn_0.2s_ease-out]"
//                 >
//                     <h4 className="text-sm text-accent font-semibold mb-3">
//                         {MenuOptions[hoveredIdx].title}
//                     </h4>
//                     <hr className="mb-3 border-theme" />

//                     <ul className="space-y-1">
//                         {MenuOptions[hoveredIdx].title !== "Library" &&
//                             MenuOptions[hoveredIdx].submenu?.map((item, i) => (
//                                 <li
//                                     key={i}
//                                     className="text-xs cursor-pointer text-muted bg-sHover-hover flex items-center gap-2 px-1.5 py-1 rounded-sm transition-all duration-200"
//                                     onClick={() => handleMenuClick(item.label, i)}
//                                 >
//                                     {item.icon}
//                                     <span>{item.label}</span>
//                                 </li>
//                             ))}

//                         {MenuOptions[hoveredIdx].title === "Library" && (
//                             <div className="h-[calc(100vh-65px)] overflow-y-auto overflow-x-hidden">
//                                 {searchInputsArray.map((item, i) => (
//                                     <div
//                                         key={i}
//                                         className="flex items-center justify-between group py-1 px-1.5 rounded-sm
//                                     bg-sHover-hover transition-all duration-200 cursor-pointer"
//                                         onClick={() => handleMenuClick(item, i)}
//                                     >
//                                         <li className="text-xs text-dark group-hover:text-accent truncate">
//                                             {item}
//                                         </li>
//                                         <Trash2
//                                             onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 handleDeleteLibraryItem(libIdsArray[i]);
//                                             }}
//                                             className="h-4 w-4 text-muted opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
//                                         />
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </ul>
//                 </div>
//             )}
//         </>
//     );
// }