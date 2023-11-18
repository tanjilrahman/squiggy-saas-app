"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { Session } from "next-auth";
import { Button } from "./ui/button";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import DarkModeToggle from "./DarkModeToggle";

function UserButton({ session }: { session: Session | null }) {
  const router = useRouter();
  // Subscription listener...

  if (!session)
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant={"outline"}
          onClick={() => {
            signIn();
            router.push("/dashboard");
          }}
        >
          Sign In
        </Button>
        <Button
          variant={"outline"}
          onClick={() => {
            signIn();
            router.push("/dashboard");
          }}
        >
          Sign Up
        </Button>
      </div>
    );
  return (
    session && (
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full">
          <UserAvatar name={session.user?.name} image={session.user?.image} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground mr-3">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/register")}>
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DarkModeToggle />
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
}

export default UserButton;
