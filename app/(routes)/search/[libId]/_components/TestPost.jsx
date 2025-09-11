"use client";
import { useEffect } from "react";

export default function TestPost() {
  useEffect(() => {
    const sendPostRequest = async () => {
      try {
        const response = await fetch("/api/test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "Hello from frontend" }),
        });

        if (!response.ok) {
          alert("POST request failed with status: " + response.status);
          console.error("POST request failed:", response.status);
          return;
        }

        const data = await response.json();
        alert("POST succeeded: " + JSON.stringify(data));
        console.log("POST response data:", data);
      } catch (err) {
        alert("POST request error: " + err.message);
        console.error("POST request error:", err);
      }
    };

    sendPostRequest();
  }, []);

  return <div>Sending POST request to /api/test on mount. Check alerts and console logs.</div>;
}
