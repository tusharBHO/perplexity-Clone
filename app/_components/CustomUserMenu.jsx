"use client";
import { useUser, useClerk } from "@clerk/nextjs";
import { Popover, PopoverTrigger, PopoverContent } from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { LogOut, Settings, User, Sliders, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { useToast } from "../../context/ToastContext";

export default function CustomUserMenu() {
    const { user, isSignedIn } = useUser();
    const { signOut } = useClerk();
    const { showToast } = useToast();

    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleLogout = () => {
        setConfirmOpen(true);
    };

    const confirmLogout = async () => {
        setConfirmOpen(false);
        try {
            await signOut();
            showToast("✅ You have been signed out.");
        } catch (err) {
            console.error("Logout failed:", err);
            showToast("⚠️ Sign out failed. Please try again.");
        }
    };

    return (
        <>
            <Popover>
                {/* Trigger (Avatar button) */}
                <PopoverTrigger asChild>
                    <button className="p-0 rounded-full cursor-pointer">
                        {isSignedIn ? (
                            <img
                                src={user?.imageUrl}
                                alt="avatar"
                                className="w-9 h-9 md:w-9 md:h-9 rounded-full border border-theme shadow bg-primary"
                            />
                        ) : (
                            <div className="flex items-center justify-center rounded-full border border-theme shadow bg-secondary">
                                <User className="w-7 h-7 md:w-9 md:h-9 text-muted" />
                            </div>
                        )}
                    </button>
                </PopoverTrigger>

                {/* Popover content */}
                <PopoverContent
                    className="w-46 p-2 space-y-1 rounded-lg shadow-lg border border-theme bg-primary text-dark"
                >
                    {isSignedIn ? (
                        <>
                            {/* User info */}
                            <div className="px-2 py-1.5">
                                <p className="font-medium text-dark text-lg">{user?.fullName}</p>
                                <p className="text-xs text-muted">{user?.primaryEmailAddress?.emailAddress}</p>
                            </div>

                            <hr className="my-2 border-theme" />

                            <Link href="/profile/account">
                                <button className="!pl-1 h-7 w-full justify-start gap-2 text-dark text-sm bg-pHover-hover flex items-center">
                                    <User className="h-5 w-5 md:w-4 md:h-4 text-accent" /> Account
                                </button>
                            </Link>

                            <Link href="/profile/preferences">
                                <button className="!pl-1 w-full justify-start gap-2 text-dark h-7 text-sm bg-pHover-hover flex items-center">
                                    <Sliders className="h-5 w-5 md:w-4 md:h-4 text-accent" /> Preferences
                                </button>
                            </Link>

                            <Link href="/profile/account">
                                <button className="!pl-1 w-full justify-start gap-2 text-dark h-7 text-sm bg-pHover-hover flex items-center">
                                    <Settings className="h-5 w-5 md:w-4 md:h-4 text-accent" /> All Settings
                                </button>
                            </Link>

                            <hr className="my-2 border-theme" />

                            {/* Logout button */}
                            <button
                                className="!pl-1 h-7 w-full justify-start gap-2 text-sm text-red-600 hover:text-red-500 hover:bg-secondary flex items-center"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-5 w-5 md:w-4 md:h-4" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/sign-in">
                                <button className="!pl-1 h-7 w-full justify-start gap-2 text-dark text-sm hover:bg-secondary flex items-center">
                                    <LogIn className="h-5 w-5 md:w-4 md:h-4 text-accent" /> Sign In
                                </button>
                            </Link>
                            <Link href="/sign-up">
                                <button className="!pl-1 h-7 w-full justify-start gap-2 text-dark text-sm hover:bg-secondary flex items-center">
                                    <UserPlus className="h-5 w-5 md:w-4 md:h-4 text-accent" /> Sign Up
                                </button>
                            </Link>
                        </>
                    )}
                </PopoverContent>
            </Popover>

            {/* Confirm Logout Dialog */}
            <ConfirmDialog
                open={confirmOpen}
                title="Sign Out"
                message="Are you sure you want to sign out?"
                onConfirm={confirmLogout}
                onCancel={() => setConfirmOpen(false)}
            />
        </>
    );
}