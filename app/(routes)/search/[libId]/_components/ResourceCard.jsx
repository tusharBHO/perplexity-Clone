"use client";
import React from "react";

export default function ResourceCard({ href, children }) {
  // extract domain for favicon
  const url = new URL(href);
  const domain = url.hostname;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-accent-hover inline-flex items-center gap-2 px-1 py-0 rounded-sm bg-[#E8E8E3] dark:bg-[#2D2F2F] shadow-sm hover:shadow-md transition w-fit"
    >
      {/* Favicon */}
      {/* <img
        src={`https://www.google.com/s2/favicons?domain=${domain}`}
        alt=""
        className="w-4 h-4"
      /> */}

      {/* Link text */}
      <span className="text-[11px] font-medium lowercase text-gray-500 dark:text-gray-300 hover:text-white dark:hover:text-black truncate ">
        {children}
      </span>
    </a>
  );
}
