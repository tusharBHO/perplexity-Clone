"use client";
import { useUser, useClerk } from "@clerk/nextjs";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User, Sliders, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export default function CustomUserMenu() {
    const { user, isSignedIn } = useUser();
    const { signOut } = useClerk();

    return (
        <Popover>
            {/* Trigger (Avatar button) */}
            <PopoverTrigger asChild>
                <Button variant="ghost" className="p-0 rounded-full cursor-pointer">
                    {isSignedIn ? (
                        <img
                            src={user?.imageUrl}
                            alt="avatar"
                            className="w-7 h-7 rounded-full border border-theme shadow bg-primary"
                        />
                    ) : (
                        <div className="w-7 h-7 flex items-center justify-center rounded-full border border-theme shadow bg-secondary">
                            <User className="w-5 h-5 text-muted" />
                        </div>
                    )}
                </Button>
            </PopoverTrigger>

            {/* Popover content */}
            <PopoverContent
                className="w-46 p-2 space-y-1 rounded-xl shadow-lg 
                   border border-theme bg-primary text-dark"
            >
                {isSignedIn ? (
                    <>
                        {/* User info */}
                        <div className="px-2 py-1.5">
                            <p className="font-medium text-dark text-sm">{user?.fullName}</p>
                            <p className="text-xs text-muted">
                                {user?.primaryEmailAddress?.emailAddress}
                            </p>
                        </div>

                        <hr className="my-2 border-theme" />

                        <Link href="/profile/account">
                            <Button
                                variant="ghost"
                                className="!pl-1 h-7 w-full justify-start gap-2 text-dark text-xs bg-pHover-hover"
                            >
                                <User className="w-2 h-2 text-accent" /> Account
                            </Button>
                        </Link>

                        <Link href="/profile/preferences">
                            <Button
                                variant="ghost"
                                className="!pl-1 w-full justify-start gap-2 text-dark h-7 text-xs bg-pHover-hover"
                            >
                                <Sliders style={{ scale: 0.80 }} className=" text-accent" /> Preferences
                            </Button>
                        </Link>

                        <Link href="/profile/account">
                            <Button
                                variant="ghost"
                                className="!pl-1 w-full justify-start gap-2 text-dark h-7 text-xs bg-pHover-hover"
                            >
                                <Settings style={{ scale: 0.80 }} className=" text-accent" /> All Settings
                            </Button>
                        </Link>

                        <hr className="my-2 border-theme" />

                        <Button
                            variant="ghost"
                            className="!pl-1 h-7 w-full justify-start gap-2 text-red-600 hover:text-red-500 hover:bg-secondary"
                            onClick={() => signOut()}
                        >
                            <LogOut style={{ scale: 0.80 }} className="" /> Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Link href="/sign-in">
                            <Button
                                variant="ghost"
                                className="!pl-1 h-7 w-full justify-start gap-2 text-dark text-xs hover:bg-secondary"
                            >
                                <LogIn style={{ scale: 0.85 }} className=" text-accent" /> Sign In
                            </Button>
                        </Link>
                        <Link href="/sign-up">
                            <Button
                                variant="ghost"
                                className="!pl-1 h-7 w-full justify-start gap-2 text-dark text-xs hover:bg-secondary"
                            >
                                <UserPlus style={{ scale: 0.85 }} className=" text-accent" /> Sign Up
                            </Button>
                        </Link>
                    </>
                )}
            </PopoverContent>
        </Popover>
    );
}