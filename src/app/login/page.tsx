"use client";

import { signIn } from "next-auth/react";
import { MessageSquare } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 glass-panel rounded-3xl text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-white/5 rotate-45 pointer-events-none"></div>
        <div className="flex justify-center mb-8 relative z-10">
          <div className="w-24 h-24 neu-flat flex items-center justify-center text-[var(--foreground)] rounded-full">
            <MessageSquare size={40} />
          </div>
        </div>
        <h1 className="text-4xl font-light mb-3 text-white drop-shadow-lg relative z-10">ChatApp</h1>
        <p className="text-white/90 mb-10 font-medium relative z-10 text-lg">Next-gen messaging experience.</p>
        
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full flex items-center justify-center space-x-3 neu-button py-4 px-6 font-semibold text-lg relative z-10"
        >
          <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-6 h-6" />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}
