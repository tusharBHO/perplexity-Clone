import React from 'react'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-markdown'
import okaidia from 'react-markdown'
// import React from "react";
// import ReactMarkdown from "react-markdown";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

function DisplaySummary({ aiResp }) {
    return (
        <div className="mt-7">
            {!aiResp && (
                <div>
                    <div className="w-full h-5 bg-accent rounded-md animate-pulse"></div>
                    <div className="w-1/2 mt-2 h-5 bg-accent rounded-md animate-pulse"></div>
                    <div className="w-[70%] mt-2 h-5 bg-accent rounded-md animate-pulse"></div>
                </div>
            )}

            <ReactMarkdown
                components={{
                    h1: ({ node, ...props }) => (
                        <h1
                            className="text-4xl font-bold text-blue-800 mb-4 leading-snug"
                            {...props}
                        />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2
                            className="text-3xl font-semibold text-blue-700 mb-3 leading-snug"
                            {...props}
                        />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3
                            className="text-2xl font-semibold text-blue-600 mt-4 mb-2 leading-tight"
                            {...props}
                        />
                    ),
                    p: ({ node, ...props }) => (
                        <p className="text-gray-700 leading-relaxed mb-4" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                        <a
                            className="text-blue-600 underline hover:text-blue-800"
                            target="_blank"
                            rel="noreferrer"
                            {...props}
                        />
                    ),
                    ul: ({ node, ordered, depth, ...props }) => (
                        <ul
                            className="list-disc list-inside space-y-2 leading-relaxed"
                            {...props}
                        />
                    ),
                    li: ({ node, ordered, ...props }) => (
                        <li className="mb-1" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                        <blockquote
                            className="bg-gray-100 p-4 rounded-lg text-gray-700 leading-relaxed mb-6"
                            {...props}
                        />
                    ),

                    // Table Styling
                    table: ({ node, ...props }) => (
                        <table
                            className="table-auto w-full text-sm text-gray-700 border-collapse border border-gray-300"
                            {...props}
                        />
                    ),
                    th: ({ node, ...props }) => (
                        <th
                            className="border border-gray-300 px-4 py-2 bg-gray-100 text-left"
                            {...props}
                        />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="border border-gray-300 px-4 py-2" {...props} />
                    ),

                    // Code Block Styling with Syntax Highlighter
                    code: ({ node, inline, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={okaidia}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-md overflow-auto"
                            >
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        ) : (
                            <code className="bg-gray-100 p-1 rounded-md" {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {aiResp}
            </ReactMarkdown>
        </div>
    );
}

export default DisplaySummary;










// import React from 'react'
// import ReactMarkdown from 'react-markdown'
// import SyntaxHighlighter from 'react-markdown'
// import okaidia from 'react-markdown'

// function DisplaySummary({ aiResp }) {
//     return (
//         <div className='mt-7'>
//             {!aiResp &&         // !aiResp
//                 < div >
//                     <div className='w-full h-5 bg-accent rounded-md animate-pulse'></div>
//                     <div className='w-1/2 mt-2 h-5 bg-accent rounded-md animate-pulse'></div>
//                     <div className='w-[70%] mt-2 h-5 bg-accent rounded-md animate-pulse'></div>
//                 </div>}

//             <ReactMarkdown
//                 components={{
//                     h1: ({ node, ...props }) => (
//                         <h1 className="text-4xl font-bold text-blue-800 mb-4 leading-snug" {...props} />
//                     ),
//                     h2: ({ node, ...props }) => (
//                         <h2 className="text-3xl font-semibold text-blue-700 mb-3 leading-snug" {...props} />
//                     ),
//                     h3: ({ node, ...props }) => (
//                         <h3 className="text-2xl font-semibold text-blue-600 mt-4 mb-2 leading-tight" {...props} />
//                     ),
//                     p: ({ node, ...props }) => (
//                         <p className="text-gray-700 leading-relaxed mb-4" {...props} />
//                     ),
//                     a: ({ node, ...props }) => (
//                         <a
//                             className="text-blue-600 underline hover:text-blue-800"
//                             target="_blank"
//                             rel="noreferrer"
//                             {...props}
//                         />
//                     ),
//                     ul: ({ node, ...props }) => (
//                         <ul className="list-disc list-inside space-y-2 leading-relaxed" {...props} />
//                     ),
//                     // li: ({ node, ...props }) => (
//                     //     <li className="mb-1" {...props} />
//                     // ),
//                     li: ({ node, ordered, ...props }) => (
//                         <li className="mb-1" {...props} />
//                     ),
//                     blockquote: ({ node, ...props }) => (
//                         <blockquote className="bg-gray-100 p-4 rounded-lg text-gray-700 leading-relaxed mb-6" {...props} />
//                     ),

//                     // Table Styling
//                     table: ({ node, ...props }) => (
//                         <table className="table-auto w-full text-sm text-gray-700 border-collapse border border-gray-300" {...props} />
//                     ),
//                     th: ({ node, ...props }) => (
//                         <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left" {...props} />
//                     ),
//                     td: ({ node, ...props }) => (
//                         <td className="border border-gray-300 px-4 py-2" {...props} />
//                     ),

//                     // Code Block Styling with Syntax Highlighter
//                     code: ({ node, inline, className, children, ...props }) => {
//                         const match = /language-(\w+)/.exec(className || "");
//                         return !inline && match ? (
//                             <div> {children} </div>

//                             // <SyntaxHighlighter
//                             //     style={okaidia}
//                             //     language={match[1]}
//                             //     PreTag="div"
//                             //     className="rounded-md overflow-auto"
//                             // >
//                             //     {String(children).replace(/\n$/, "")}
//                             // </SyntaxHighlighter>
//                         ) : (
//                             <code className="bg-gray-100 p-1 rounded-md" {...props}>
//                                 {children}
//                             </code>
//                         );
//                     },
//                 }}
//             >
//                 {aiResp}
//             </ReactMarkdown>
//         </div >
//     )
// }

// export default DisplaySummary