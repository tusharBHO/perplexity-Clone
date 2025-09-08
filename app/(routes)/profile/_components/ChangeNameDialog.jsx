"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useToast } from "../../../../context/ToastContext"

export default function ChangeNameDialog({ open, setOpen }) {
  const { user } = useUser();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  if (!open) return null; // don't render if dialog is closed

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [firstName, ...rest] = fullName.trim().split(" ");
      const lastName = rest.join(" ");
      await user.update({ firstName, lastName });
      await user.reload(); // refresh user data
      setOpen(false);
      showToast("Name updated successfully!")
    } catch (err) {
      showToast("Failed to update name");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[400px] border border-theme">
        <h2 className="text-lg font-semibold text-gray-900  mb-4">
          Change Full Name
        </h2>

        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border border-theme bg-white text-gray-900 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Enter new full name"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-lg border border-theme text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-accent text-white hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}