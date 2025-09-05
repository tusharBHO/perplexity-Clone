"use client";
import { useState } from "react";
import Sidebar from "./_components/Sidebar";
import { Menu } from "lucide-react";

export default function ProfileLayout({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="h-screen w-screen flex bg-primary">
            {/* Sidebar - desktop */}
            <div className="hidden md:block">
                <Sidebar /> {/* no onClose needed here */}
            </div>

            {/* Sidebar - mobile */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    {/* Drawer */}
                    <div className="shadow-lg">
                        {/* here we pass onClose */}
                        <Sidebar onClose={() => setIsOpen(false)} />
                    </div>
                    {/* Overlay */}
                    <div
                        className="flex-1 bg-black/40"
                        onClick={() => setIsOpen(false)}
                    />
                </div>
            )}

            {/* Main content */}
            <main className="flex-1 h-full sm:p-4 md:pt-10 md:w-[55%] mx-auto">
                {/* Hamburger for mobile */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="md:hidden p-2 text-dark rounded hover:bg-secondary"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {children}
            </main>
        </div>
    );
}