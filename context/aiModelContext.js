// context/aiModelContext.js
'use client'
import React, { createContext, useContext, useState } from 'react';

const AiModelContext = createContext();

export function AiModelProvider({ children }) {
    const [aiModel, setAiModel] = useState('gemini-1.5-flash'); // Default model

    return (
        <AiModelContext.Provider value={{ aiModel, setAiModel }}>
            {children}
        </AiModelContext.Provider>
    );
}

export function useAiModel() {
    return useContext(AiModelContext);
}