// app/(routes)/search/[libId]/page.jsx
"use client"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../../services/supabase';
import DisplayResult from './_components/DisplayResult'

function SearchQueryResult() {
  const { libId } = useParams()
  const [searchInputRecord, setSearchInputRecord] = useState(null)

  useEffect(() => {
    GetSearchQueryRecord()
  }, [])

  const GetSearchQueryRecord = async () => {
    let { data: Library, error } = await supabase
      .from('Library')
      .select('*, Chats(*)')
      .eq('libId', libId)

    if (!error && Library?.length > 0) {
      setSearchInputRecord(Library[0])
    }
  }

  return (
    <div className="md:ml-14 bg-primary h-full overflow-y-scroll">
      <div className="px-5 h-full sm:px-10 md:px-20 lg:px-36 xl:px-56 md:pt-10">
        {searchInputRecord ? (
          <DisplayResult searchInputRecord={searchInputRecord} />
        ) : (
          <div className="text-center text-muted mt-10">
            Loading your search...
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchQueryResult