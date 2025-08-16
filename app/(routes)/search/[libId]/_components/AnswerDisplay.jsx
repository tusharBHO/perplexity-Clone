import React from 'react'
import Image from 'next/image';
import SourceList from './SourceList'
import DisplaySummary from './DisplaySummary'

function AnswerDisplay({ chat, loadingSearch }) {
  return (
    <div>
      <SourceList webResult={chat?.searchResult} loadingSearch={loadingSearch} />  {/* loadingSearch={loadingSearch} */}
      <DisplaySummary aiResp={chat?.aiResp} />
    </div>
  )
}

export default AnswerDisplay