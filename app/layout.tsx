"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import UserSync from "@/component/UserSync";
import Sidebar from "@/component/chat/Sidebar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const isChatting = pathname.split("/").filter(Boolean).length > 1;

  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-[#050505] text-white antialiased`}
      >
        <Providers>
          {!isLandingPage ? (
            <>
              <UserSync />
              <div className="flex h-screen w-full overflow-hidden">
                <div
                  className={`${isChatting ? "hidden" : "flex"} md:flex h-full w-full md:w-auto`}
                >
                  <Sidebar />
                </div>{" "}
                <main
                  className={`
              flex-1 flex flex-col min-w-0 bg-black relative
              ${isChatting ? "flex" : "hidden"} 
              md:flex
            `}
                >
                  {children}
                </main>
              </div>{" "}
            </>
          ) : (
            <main
              className={`
              flex-1 flex flex-col min-w-0 bg-black relative
              ${isChatting ? "flex" : "hidden"} 
              md:flex
            `}
            >
              {children}
            </main>
          )}
        </Providers>
      </body>
    </html>
  );
}
