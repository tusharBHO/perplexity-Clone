// app/(routes)/search/[libId]/_components/AnswerDisplay.jsx
import React from "react";
import SourceList from "./SourceList";
import DisplaySummary from "./DisplaySummary";
import ChatExportHTML from "./ChatExportHTML";
import { FileText, FileDown, Download } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

function AnswerDisplay({ chat, loadingSearch, onDeleteChat, isDeletable }) {
  // PDF export
  const handleExportPDF = async () => {
    const html = document.getElementById(`export-chat-${chat.id}`).innerHTML;

    const response = await fetch("/api/export-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        html,
        title: chat.userSearchInput?.slice(0, 30) || "Chat",
      }),
    });

    if (!response.ok) {
      // Optionally display message/notification to user
      const errorMsg = await response.text();
      console.error("PDF generation failed:", errorMsg);
      return;
    }

    const blob = await response.blob();
    const pdfBlob = new Blob([blob], { type: "application/pdf" }); // optional redundancy
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${(chat.userSearchInput || "chat").replace(/[^\w\s-]/g, "")}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Markdown export
  const handleExportMarkdown = () => {
    let md = `# Prompt\n\n${chat.userSearchInput || ""}\n\n`;
    md += `## Response\n\n${chat.aiResp || "_No response_"}\n\n`;

    if (chat.searchResult?.length > 0) {
      md += `## Sources\n\n`;
      chat.searchResult.forEach((src) => {
        md += `- [${src.title || src.link}](${src.link})\n`;
      });
    }

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${(chat.userSearchInput || "chat").replace(/[^\w\s-]/g, "")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <SourceList webResult={chat?.searchResult} loadingSearch={loadingSearch} />
      <DisplaySummary
        aiResp={chat?.aiResp}
        libId={chat?.libId}
        chatId={chat?.id}
        onDelete={onDeleteChat}
        isDeletable={isDeletable}
      />

      {/* Hidden export area */}
      <div id={`export-chat-${chat.id}`} className="hidden">
        <ChatExportHTML chat={chat} />
      </div>

      {/* Single Export Button with Dropdown */}
      {/* <div className="mt-2 flex justify-end relative bottom-10"> */}
      <div className="mt-2 flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <button
              variant="outline"
              // size="sm"
              // className="flex items-center gap-2 rounded-lg text-xs"
              className="bg-sHover-hover inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-sm bg-secondary text-muted01 hover:text-dark transition-colors relative bottom-10"
            >
              <Download className="w-4 h-4 md:w-3 md:h-3" />
              Export
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={6}
            className="w-44 py-2 px-1 rounded-lg shadow-lg border border-theme bg-primary text-muted01"
          >
            <button
              variant="ghost"
              className="bg-sHover-hover !pl-1 w-full h-6 justify-start gap-2 text-sm text-muted01 flex items-center"
              onClick={handleExportPDF}
            >
              <FileText className="w-4 h-4 md:w-3 md:h-3 text-accent" /> Export as PDF
            </button>

            <button
              variant="ghost"
              className="bg-sHover-hover !pl-1 w-full h-6 justify-start gap-2 text-sm text-muted01 flex items-center"
              onClick={handleExportMarkdown}
            >
              <FileDown className="w-4 h-4 md:w-3 md:h-3 text-accent" /> Export as Markdown
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default AnswerDisplay;











// // app/(routes)/search/[libId]/_components/AnswerDisplay.jsx
// import React from 'react'
// import Image from 'next/image';
// import SourceList from './SourceList'
// import DisplaySummary from './DisplaySummary'

// import ChatExportHTML from "./ChatExportHTML";
// import { FileText, FileDown } from "lucide-react";

// function AnswerDisplay({ chat, loadingSearch, onDeleteChat, isDeletable }) {
//   console.log('chat', chat)

//   // PDF export
//   const handleExportPDF = async () => {
//     const html = document.getElementById(`export-chat-${chat.id}`).innerHTML;

//     const response = await fetch("/api/export-pdf", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         html,
//         title: chat.userSearchInput?.slice(0, 30) || "Chat",
//       }),
//     });

//     const blob = await response.blob();
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${(chat.userSearchInput || "chat").replace(/[^\w\s-]/g, "")}.pdf`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   // Markdown export
//   const handleExportMarkdown = () => {
//     let md = `# Prompt\n\n${chat.userSearchInput || ""}\n\n`;
//     md += `## Response\n\n${chat.aiResp || "_No response_"}\n\n`;

//     if (chat.searchResult?.length > 0) {
//       md += `## Sources\n\n`;
//       chat.searchResult.forEach((src) => {
//         md += `- [${src.title || src.link}](${src.link})\n`;
//       });
//     }

//     const blob = new Blob([md], { type: "text/markdown" });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${(chat.userSearchInput || "chat").replace(/[^\w\s-]/g, "")}.md`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div>
//       <SourceList webResult={chat?.searchResult} loadingSearch={loadingSearch} />
//       <DisplaySummary aiResp={chat?.aiResp} libId={chat?.libId} chatId={chat?.id} onDelete={onDeleteChat} isDeletable={isDeletable} />


//       {/* Hidden export area */}
//       <div id={`export-chat-${chat.id}`} className="hidden">
//         <ChatExportHTML chat={chat} />
//       </div>

//       {/* Export buttons */}
//       <div className="flex gap-2 mt-2">
//         <button onClick={handleExportPDF} className="px-2 py-1 bg-secondary rounded">
//           <FileText className="w-4 h-4" /> Export PDF
//         </button>
//         <button onClick={handleExportMarkdown} className="px-2 py-1 bg-secondary rounded">
//           <FileDown className="w-4 h-4" /> Export Markdown
//         </button>
//       </div>

//     </div>
//   )
// }

// export default AnswerDisplay