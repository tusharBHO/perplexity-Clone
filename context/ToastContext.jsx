import React, { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000); // Auto-hide after 3s
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <div className="
                    fixed bottom-5 left-1/2 transform -translate-x-1/2 
                    px-4 py-2 rounded shadow-lg text-sm z-50
                    bg-secondary text-dark
                    border border-theme
                    animate-fadeIn
                ">
                    {toast}
                </div>
            )}
        </ToastContext.Provider>
    );
}
