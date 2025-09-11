import Image from "next/image";
import ChatInputBox from "./_components/ChatInputBox";

export default function Home() {
  return (
    // <div className="w-full h-screen">
    <div className="h-[100dvh] w-[100vw]">
      <ChatInputBox />
    </div>
  );
}

// Reamain Drama -> 00:00:00
// command to run in terminal : npm run dev
// command to run in terminal : npx inngest-cli@latest dev

// Task for me:
// 1. make the different ai models available in the chat input box inlcuding openai