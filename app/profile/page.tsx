import { auth } from "@clerk/nextjs";
import React from "react";
import UserPreferences from "./components/UserPreferences";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { UserStateType } from "@/store/store";

async function Profile() {
  const { userId } = auth();

  if (!userId) return redirect("/auth-callback?origin=dashboard");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) return redirect("/auth-callback?origin=dashboard");

  const dbUserObject: UserStateType = {
    currency: dbUser.currency,
    isPro: false,
  };

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
        <h2 className="mb-5 text-3xl tracking-tight font-bold text-gray-900 dark:text-white">
          Profile
        </h2>
      </div>
      <UserPreferences dbUser={dbUserObject} />
    </div>
  );
}

export default Profile;
