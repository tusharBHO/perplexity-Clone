"use client";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center h-[100dvh] bg-primary">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        // 👇 hides "Secured by Clerk" footer
        appearance={{
          elements: {
            footer: "hidden",
          },
        }}
      />
    </div>
  );
}