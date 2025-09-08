// components/ui/ConfirmDialog.jsx
"use client";
import React from "react";

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-primary dark:bg-dark rounded-xl p-6 w-80 shadow-lg">
                <h3 className="text-lg font-semibold text-dark dark:text-primary mb-2">{title}</h3>
                <p className="text-sm text-muted01 mb-4">{message}</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-md border border-border text-muted bg-sHover-hover hover:bg-sHover transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-accent text-white hover:opacity-90 transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
