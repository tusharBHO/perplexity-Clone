"use client";
import React, { useState, useEffect, useRef } from "react";
import { Mic } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export default function AudioRecorder({ onTranscriptChange }) {
    const [isRecording, setIsRecording] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const recognitionRef = useRef(null);
    const { showToast } = useToast();

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setIsSupported(false);
            showToast("🚫 Speech Recognition API not supported on this device.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            let finalTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript + " ";
                }
            }

            if (finalTranscript.trim()) {
                onTranscriptChange(finalTranscript);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsRecording(false);
            showToast(`⚠️ Recognition error: ${event.error}`);
        };

        recognitionRef.current = recognition;
    }, [onTranscriptChange, showToast]);

    const startRecording = () => {
        if (recognitionRef.current && !isRecording) {
            recognitionRef.current.start();
            setIsRecording(true);
            showToast("🎙️ Recording started");
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
            showToast("🛑 Recording stopped");
        }
    };

    // if (!isSupported) {
    //     return (
    //         <div className="text-red-500 text-sm">
    //             🚫 Sorry, your device does not support voice-to-text feature.
    //         </div>
    //     );
    // }

    return (
        <button
            onClick={isRecording ? stopRecording : startRecording}
            className="rounded-sm text-gray-500 bg-sHover-hover cursor-pointer"
            aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
            <Mic className={`p-2 h-9 w-9 md:h-8 md:w-8 ${isRecording ? "text-green-600" : "text-gray-500"}`} />
        </button>
    );
}











// import React, { useState, useEffect, useRef } from "react";
// import { Mic } from "lucide-react";

// export default function AudioRecorder({ onTranscriptChange }) {
//     const [isRecording, setIsRecording] = useState(false);
//     const [isSupported, setIsSupported] = useState(true);
//     const [toast, setToast] = useState(null);
//     const recognitionRef = useRef(null);

//     useEffect(() => {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

//         if (!SpeechRecognition) {
//             setIsSupported(false);
//             showToast("🚫 Speech Recognition API not supported on this device.");
//             return;
//         }

//         const recognition = new SpeechRecognition();
//         recognition.continuous = true;
//         recognition.interimResults = true;

//         recognition.onresult = (event) => {
//             let finalTranscript = "";
//             for (let i = event.resultIndex; i < event.results.length; i++) {
//                 const result = event.results[i];
//                 if (result.isFinal) {
//                     finalTranscript += result[0].transcript + " ";
//                 }
//             }

//             if (finalTranscript.trim()) {
//                 onTranscriptChange(finalTranscript);
//             }
//         };

//         recognition.onerror = (event) => {
//             console.error("Speech recognition error:", event.error);
//             setIsRecording(false);
//             showToast(`⚠️ Recognition error: ${event.error}`);
//         };

//         recognitionRef.current = recognition;
//     }, [onTranscriptChange]);

//     const showToast = (msg) => {
//         setToast(msg);
//         setTimeout(() => setToast(null), 3000); // Hide after 3 seconds
//     };

//     const startRecording = () => {
//         if (recognitionRef.current && !isRecording) {
//             recognitionRef.current.start();
//             setIsRecording(true);
//             showToast("🎙️ Recording started");
//         }
//     };

//     const stopRecording = () => {
//         if (recognitionRef.current && isRecording) {
//             recognitionRef.current.stop();
//             setIsRecording(false);
//             showToast("🛑 Recording stopped");
//         }
//     };

//     if (!isSupported) {
//         return (
//             <div className="text-red-500 text-sm">
//                 🚫 Sorry, your device does not support voice-to-text feature.
//             </div>
//         );
//     }

//     return (
//         <div className="relative inline-block">
//             <button
//                 onClick={isRecording ? stopRecording : startRecording}
//                 className="rounded-sm text-gray-500 bg-sHover-hover cursor-pointer"
//                 aria-label={isRecording ? "Stop recording" : "Start recording"}
//             >
//                 <Mic className={`p-2 h-9 w-9 md:h-8 md:w-8 ${isRecording ? "text-green-600" : "text-gray-500"}`} />
//             </button>

//             {toast && (
//                 <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-dark text-white text-sm rounded shadow-lg animate-fadeIn">
//                     {toast}
//                 </div>
//             )}
//         </div>
//     );
// }









// import React, { useState, useEffect, useRef } from "react";
// import { Mic } from "lucide-react";

// export default function AudioRecorder({ onTranscriptChange }) {
//     const [isRecording, setIsRecording] = useState(false);
//     const recognitionRef = useRef(null);

//     useEffect(() => {
//         // Detect if browser supports SpeechRecognition
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (!SpeechRecognition) {
//             return;
//         }

//         // Configure SpeechRecognition instance
//         const recognition = new SpeechRecognition();
//         recognition.continuous = true;   // Keep listening until stopped
//         recognition.interimResults = true; // Capture speech as it's spoken

//         // Handle recognition results
//         recognition.onresult = (event) => {
//             let finalTranscript = "";
//             for (let i = event.resultIndex; i < event.results.length; i++) {
//                 const result = event.results[i];
//                 if (result.isFinal) {
//                     finalTranscript += result[0].transcript + " ";
//                 }
//             }
//             // Pass completed transcript back to parent
//             if (finalTranscript.trim()) {
//                 onTranscriptChange(finalTranscript);
//             }
//         };

//         // Handle recognition errors
//         recognition.onerror = (event) => {
//             console.error("Speech recognition error:", event.error);
//             setIsRecording(false);
//         };

//         recognitionRef.current = recognition;
//     }, [onTranscriptChange]);

//     // Start microphone recording
//     const startRecording = () => {
//         if (recognitionRef.current && !isRecording) {
//             recognitionRef.current.start();
//             setIsRecording(true);
//         }
//     };

//     // Stop microphone recording
//     const stopRecording = () => {
//         if (recognitionRef.current && isRecording) {
//             recognitionRef.current.stop();
//             setIsRecording(false);
//         }
//     };

//     return (
//         <button
//             onClick={isRecording ? stopRecording : startRecording}
//             className="rounded-sm text-gray-500 bg-sHover-hover cursor-pointer"
//             aria-label={isRecording ? "Stop recording" : "Start recording"}
//         >
//             <Mic className={`p-2 h-9 w-9 md:h-8 md:w-8 ${isRecording ? "text-green-600" : "text-gray-500"}`} />
//         </button>
//     );
// }// }