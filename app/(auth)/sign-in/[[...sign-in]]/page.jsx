"use client";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    // <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex items-center justify-center h-[100dvh] bg-primary">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        // 👇 hides "Secured by Clerk" footer
        appearance={{
          elements: {
            footer: "hidden",
          },
        }}
        className={'bg-primary'}
      />
    </div>
  );
}