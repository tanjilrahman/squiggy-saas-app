import React from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import MenuBar from "@/app/dashboard/components/MenuBar";
import { auth, currentUser } from "@clerk/nextjs";
import Logo from "@/components/Logo";
import UserButton from "@/components/UserButton";
import { Button } from "./ui/button";
import SettingsButton from "./SettingsButton";

async function Header() {
  const { userId } = auth();

  const user = await currentUser();

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-slate-950">
      <nav className="flex flex-col items-center justify-between p-5 pl-2 mx-auto sm:flex-row max-w-7xl">
        <Link href={userId ? "/dashboard" : "/"} prefetch={false}>
          <Logo />
        </Link>

        {/* {userId && (
          <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <MenuBar />
          </div>
        )} */}

        <div className="flex items-center justify-end space-x-4 ">
          {userId ? (
            <>
              <p className="cursor-pointer hover:underline text-muted-foreground/60">
                Leave feedback
              </p>
              <p className="cursor-pointer hover:underline text-muted-foreground/60">
                Guide
              </p>
              <SettingsButton />
            </>
          ) : (
            <div className="flex items-center justify-end space-x-4 ">
              <Link href="/pricing">Pricing</Link>

              <div className="flex items-center space-x-2">
                <Link href="/sign-in">
                  <Button variant={"outline"}>Sign In</Button>
                </Link>

                <Link href="/sign-up">
                  <Button variant={"outline"}>Sign Up</Button>
                </Link>
              </div>
            </div>
          )}
          <UserButton
            userName={user?.firstName + " " + user?.lastName}
            userEmail={user?.emailAddresses[0].emailAddress}
            userImg={user?.imageUrl}
            userId={userId}
          />
        </div>
      </nav>

      {/* Upgrade Banner */}
    </header>
  );
}

export default Header;
