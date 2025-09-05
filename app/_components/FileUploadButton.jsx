import { Paperclip } from "lucide-react";
import React, { useRef, useState } from "react";

export default function FileUploadButton({ onFileSelect }) {
  // Reference to the hidden file input element
  const fileInputRef = useRef(null);

  const [fileName, setFileName] = useState("");

  // Called when the user selects a file
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      setFileName(file.name);  // Update state with file name
      onFileSelect(file);      // Pass the file back to the parent component
    }
  };

  // Programmatically trigger the hidden file input click
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      {/* Button that opens the file picker dialog */}
      <button
        type="button"
        onClick={openFileDialog}
        aria-label="Attach file" // Good for accessibility (screen readers)
      >
        <Paperclip className="text-gray-500 bg-sHover-hover rounded-sm p-2 h-8 w-8 cursor-pointer" />
      </button>

      {/* Hidden file input element (user never sees this directly) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }} // Hidden from view
      />

      {/* 
        Shows selected file name. Right now, it's using `alert`, which is disruptive for UX 
        because every file selection will pop up a browser alert. Consider showing it inline (like a <p> tag) instead.
      */}
      {fileName && alert(`Selected file: ${fileName}`)}
    </>
  );
}