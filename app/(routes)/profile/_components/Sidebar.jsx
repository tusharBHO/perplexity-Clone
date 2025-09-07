// _components/Sidebar.jsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ThemeToggle from "@/app/_components/ThemeToggle";

export default function Sidebar({ onClose }) {
    const pathname = usePathname();
    const router = useRouter();

    const tabs = [
        { name: "Account", path: "/profile/account" },
        { name: "Preferences", path: "/profile/preferences" },
    ];

    return (
        <aside className="w-68 h-full border-theme border-r sm:px-4 sm:py-6 bg-primary">
            {/* Back button */}
            <button
                onClick={() => {
                    // router.back();
                    router.push('/');
                    if (onClose) onClose();
                }}
                className="flex items-center gap-2 px-2 py-1 mb-6 text-lg md:text-sm text-muted rounded-sm bg-sHover-hover"
            >
                <ArrowLeft className="w-5 h-5 md:w-4 md:h-4" />
                Back
            </button>

            {/* <ThemeToggle /> */}

            {/* Navigation */}
            <nav>
                <ul className="space-y-1">
                    {tabs.map(({ name, path }) => {
                        const isActive = pathname === path;
                        return (
                            <li key={path}>
                                <Link
                                    href={path}
                                    onClick={onClose} // closes drawer on mobile
                                    className={`flex items-center px-4 py-1 rounded-md text-dark bg-sHover-hover ${isActive ? "bg-sHover font-semibold" : ""
                                        }`}
                                >
                                    <span className="text-[17px]">{name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}