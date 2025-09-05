import React, { useState, useEffect, useRef } from "react";
import { Mic } from "lucide-react";

export default function AudioRecorder({ onTranscriptChange }) {
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Detect if browser supports SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech Recognition API not supported in this browser.");
            return;
        }

        // Configure SpeechRecognition instance
        const recognition = new SpeechRecognition();
        recognition.continuous = true;   // Keep listening until stopped
        recognition.interimResults = true; // Capture speech as it's spoken

        // Handle recognition results
        recognition.onresult = (event) => {
            let finalTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript + " ";
                }
            }
            // Pass completed transcript back to parent
            if (finalTranscript.trim()) {
                onTranscriptChange(finalTranscript);
            }
        };

        // Handle recognition errors
        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsRecording(false);
        };

        recognitionRef.current = recognition;
    }, [onTranscriptChange]);

    // Start microphone recording
    const startRecording = () => {
        if (recognitionRef.current && !isRecording) {
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    // Stop microphone recording
    const stopRecording = () => {
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <button
            onClick={isRecording ? stopRecording : startRecording}
            className="rounded-sm text-gray-500 bg-sHover-hover cursor-pointer"
            aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
            <Mic className={`p-2 h-8 w-8 ${isRecording ? "text-green-600" : "text-gray-500"}`} />
        </button>
    );
}// }