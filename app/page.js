import Image from "next/image";
import ChatInputBox from "./_components/ChatInputBox";

export default function Home() {
  return (
    <div className="w-full">
      <ChatInputBox />
    </div>
  );
}

// Reamain Drama -> 00:00:00
// command to run in terminal : npm run dev
// command to run in terminal : npx inngest-cli@latest dev