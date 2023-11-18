import React from "react";
import Logo from "./Logo";
import UserButton from "./UserButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Link from "next/link";
import { Settings } from "lucide-react";
import MenuBar from "@/app/dashboard/components/MenuBar";

async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-950">
      <nav className="flex flex-col sm:flex-row justify-between items-center p-5 pl-2 max-w-7xl mx-auto">
        <Link href={session ? "/dashboard" : "/"} prefetch={false}>
          <Logo />
        </Link>

        {session && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <MenuBar />
          </div>
        )}

        <div className="flex items-center justify-end space-x-4 ">
          {session ? (
            <>
              <p className="hover:underline cursor-pointer text-muted-foreground/60">
                Leave feedback
              </p>
              <p className="hover:underline cursor-pointer text-muted-foreground/60">
                Guide
              </p>
              <Settings className="text-muted-foreground hover:opacity-70 transition-opacity duration-150 cursor-pointer" />
            </>
          ) : (
            <Link href="/pricing">Pricing</Link>
          )}
          <UserButton session={session} />
        </div>
      </nav>

      {/* Upgrade Banner */}
    </header>
  );
}

export default Header;
