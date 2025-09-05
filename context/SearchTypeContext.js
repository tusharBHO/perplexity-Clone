// context/SearchTypeContext.js
'use client'
import React, { createContext, useContext, useState } from 'react';

const SearchTypeContext = createContext();

export function SearchTypeProvider({ children }) {
  const [searchType, setSearchType] = useState('Search');

  return (
    <SearchTypeContext.Provider value={{ searchType, setSearchType }}>
      {children}
    </SearchTypeContext.Provider>
  );
}

export function useSearchType() {
  return useContext(SearchTypeContext);
}
