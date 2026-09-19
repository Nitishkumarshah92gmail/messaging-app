"use client";

import { signIn } from "next-auth/react";
import { MessageSquare } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--color-wa-app-bg)] relative flex flex-col items-center pt-10 md:pt-24 overflow-hidden">
      {/* WhatsApp Web Green Header Band */}
      <div className="absolute top-0 left-0 w-full h-[222px] bg-[var(--color-wa-green)] z-0"></div>
      
      {/* Header Logo */}
      <div className="w-full max-w-[1000px] flex items-center mb-8 z-10 px-6">
        <MessageSquare size={32} className="text-white mr-3" />
        <span className="text-white font-medium text-[15px] tracking-wide uppercase">WhatsApp Web</span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-[1000px] bg-[var(--color-wa-panel)] rounded-sm shadow-[0_17px_50px_0_rgba(0,0,0,.19),0_12px_15px_0_rgba(0,0,0,.24)] z-10 flex flex-col md:flex-row min-h-[500px]">
        
        {/* Left Side: Instructions */}
        <div className="flex-1 p-10 md:p-14 pr-4">
          <h1 className="text-[28px] font-light text-[var(--color-wa-text)] mb-10">Use WhatsApp on your computer</h1>
          <ol className="text-[18px] text-[var(--color-wa-text-muted)] leading-relaxed space-y-6 font-light">
            <li>1. Open WhatsApp on your phone</li>
            <li>2. Tap <strong>Menu</strong> or <strong>Settings</strong> and select <strong>Linked Devices</strong></li>
            <li>3. Tap on <strong>Link a device</strong></li>
            <li>4. Point your phone to this screen to capture the code</li>
          </ol>
        </div>

        {/* Right Side: QR Code / Login Button */}
        <div className="flex-1 flex flex-col items-center justify-center p-10 md:p-14 border-t md:border-t-0 border-[var(--color-wa-border)] relative">
          
          <div className="w-[264px] h-[264px] bg-white rounded-lg p-4 flex flex-col items-center justify-center mb-8 text-black text-center relative">
             <MessageSquare size={64} className="text-[#e9edef]" />
             <span className="absolute text-[var(--color-wa-text-muted)] text-sm font-medium mt-16">Link with Google</span>
          </div>

          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-[264px] flex items-center justify-center space-x-3 bg-white text-gray-800 hover:bg-gray-100 py-3 px-6 rounded-full font-semibold shadow-md transition-colors"
          >
            <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
