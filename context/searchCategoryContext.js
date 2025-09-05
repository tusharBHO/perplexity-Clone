// context/SearchCategoryContext.js
'use client'
import React, { createContext, useContext, useState } from 'react';

const SearchCategoryContext = createContext();

export function SearchCategoryProvider({ children }) {
    const [searchCategory, setSearchCategory] = useState('Top');
    
    return (
        <SearchCategoryContext.Provider value={{ searchCategory, setSearchCategory }}>
            {children}
        </SearchCategoryContext.Provider>
    );
}

export function useSearchCategory() {
    return useContext(SearchCategoryContext);
}