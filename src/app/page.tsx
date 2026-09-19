import { Sidebar } from "@/components/layout/sidebar"
import { ChatWindow } from "@/components/layout/chat-window"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <main className="h-full w-full flex overflow-hidden">
      <Sidebar />
      <ChatWindow />
    </main>
  );
}
