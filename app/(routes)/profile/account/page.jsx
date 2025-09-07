"use client";
import { useUser, useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ChangeNameDialog from "../_components/ChangeNameDialog";

export default function AccountInfo() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();

    const [openDialog, setOpenDialog] = useState(false);

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

        try {
            await fetch(`/api/delete-user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id }),
            });

            alert("Account deleted successfully.");
            await signOut();
        } catch (err) {
            console.error("Failed to delete account:", err);
            alert("Failed to delete account. Please try again.");
        }
    };

    const handleSignOutAll = async () => {
        if (!confirm("Do you really want to sign out of all sessions?")) return;

        try {
            await fetch(`/api/signout-all`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id }),
            });

            alert("Signed out of all sessions.");
            await signOut();
        } catch (err) {
            console.error("Failed to sign out all sessions:", err);
            alert("Failed to sign out of all sessions. Please try again.");
        }
    };

    const handleSignOut = async () => {
        if (!confirm("Are you sure you want to sign out?")) return;

        try {
            await signOut();
            alert("You have been signed out.");
        } catch (err) {
            console.error("Failed to sign out:", err);
            alert("Sign out failed. Please try again.");
        }
    };

    if (!user) return <p className="text-muted">Loading...</p>;

    return (
        // <div className="w-full h-full px-4 sm:px-6 md:px-10">
        <div className="w-full h-[calc(100vh-52px)] px-4 sm:px-6 md:px-10 overflow-y-scroll">
            {/* Account Section */}
            <section className="mb-10">
                <h1 className="text-lg font-semibold text-dark">Account</h1>
                <div className="border-t border-theme my-4"></div>

                {/* Profile Info */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
                    <img
                        src={user.imageUrl}
                        alt="avatar"
                        className="w-16 h-16 rounded-full"
                    />
                    <div className="text-center sm:text-left">
                        <p className="text-dark">{user.fullName}</p>
                        <p className="text-xs text-muted">{user.username}</p>
                        <p className="text-xs text-muted">{user.primaryEmailAddress?.emailAddress}</p>
                    </div>

                    <div className="sm:ml-auto">
                        <label className="block w-full rounded border border-theme px-3 py-1 text-xs cursor-pointer text-muted bg-pHover-hover text-center sm:text-left">
                            Change avatar
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    try {
                                        await user.setProfileImage({ file });
                                        window.location.reload();
                                    } catch (err) {
                                        console.error("Failed to update avatar:", err);
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>

                {/* Account Details */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div>
                            <p className="text-xs text-muted">Full Name</p>
                            <p className="text-sm text-dark">{user.fullName}</p>
                        </div>
                        <button
                            onClick={() => setOpenDialog(true)}
                            className="rounded border border-theme px-3 py-1 text-xs text-muted bg-pHover-hover"
                        >
                            Change full name
                        </button>
                    </div>

                    <div>
                        <p className="text-xs text-muted">Email</p>
                        <p className="text-sm text-dark">{user.primaryEmailAddress?.emailAddress}</p>
                    </div>
                </div>
            </section>

            {/* System Section */}
            <section className="pb-3">
                <h2 className="text-lg text-dark font-semibold">System</h2>
                <div className="border-t border-theme my-4"></div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5 md:mb-3 gap-2">
                    <p className="text-sm text-dark">Support</p>
                    <button
                        onClick={() => router.push("/contact")}
                        className="rounded border border-theme px-3 py-1 text-xs text-muted bg-pHover-hover"
                    >
                        Contact
                    </button>
                </div>

                <div className="mb-4 md:mb-3">
                    <p className="text-sm text-muted">
                        You are signed in as <span className="font-semibold text-dark">{user.primaryEmailAddress?.emailAddress}</span>
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5 md:mb-3 gap-2">
                    <p className="text-sm text-dark">Sign out</p>
                    <button
                        onClick={handleSignOut}
                        className="rounded border border-theme px-3 py-1 text-xs text-muted bg-pHover-hover"
                    >
                        Sign out
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5 md:mb-3 gap-2">
                    <div>
                        <p className="text-sm text-dark">Sign out of all sessions</p>
                        <p className="text-xs text-muted">Devices or browsers where you are signed in</p>
                    </div>
                    <button
                        onClick={handleSignOutAll}
                        className="rounded border border-theme px-3 py-1 text-xs text-muted bg-pHover-hover"
                    >
                        Sign out of all sessions
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                        <p className="text-sm text-dark">Delete account</p>
                        <p className="text-xs text-muted">Permanently delete your account and data</p>
                    </div>
                    <button
                        onClick={handleDeleteAccount}
                        className="rounded border border-theme px-3 py-1 text-xs text-muted bg-pHover-hover"
                    >
                        Delete Account
                    </button>
                </div>
            </section>

            <ChangeNameDialog open={openDialog} setOpen={setOpenDialog} />
        </div>
    );
}