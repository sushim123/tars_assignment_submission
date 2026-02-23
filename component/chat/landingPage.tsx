import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function LandingPage1() {
  const { userId } = await auth();

  // If already logged in, send them straight to the chat
  if (userId) {
    redirect("/chat");
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_50%)]" />

      <div className="relative z-10 max-w-2xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Real-time Chat Experience
        </div>

        <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-linear-to-br from-white to-zinc-500 bg-clip-text text-transparent">
          Connect in <br /> Real-Time.
        </h1>

        <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
          A high-performance chat application built with Next.js, Convex, and
          Clerk. Fast, secure, and beautiful.
        </p>
        <div className="flex items-center justify-center">
          <p className="bg-linear-to-br from-black/20 to-white/20 text-gray-300  rounded-3xl w-50 border border-white/30 font-light ">
            {" "}
            Made by sushim <span className="animate-pulse">❤️</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <SignInButton mode="modal">
            <button className="w-full sm:w-auto bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-zinc-300 transition-all flex items-center justify-center gap-2">
              Log In
            </button>
          </SignInButton>

          <SignInButton mode="modal">
            <button className="w-full sm:w-auto bg-zinc-900 border border-white/10 text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-all">
              Join Now
            </button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
}
