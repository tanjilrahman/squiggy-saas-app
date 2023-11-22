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
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import DarkModeToggle from "./DarkModeToggle";
import { useClerk } from "@clerk/nextjs";

type UserButtonTypes = {
  userName: string;
  userEmail: string | undefined;
  userImg: string | undefined;
  userId: string | null;
};

function UserButton({ userName, userEmail, userImg, userId }: UserButtonTypes) {
  const router = useRouter();
  const { signOut } = useClerk();
  // Subscription listener...

  return (
    userId && (
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full">
          <UserAvatar name={userName} image={userImg} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs leading-none text-muted-foreground mr-3">
                {userEmail}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/register")}>
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut(() => router.push("/"))}>
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
