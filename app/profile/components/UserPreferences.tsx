"use client";
import React, { useEffect } from "react";
import { CurrencyCombobox } from "./CurrencyCombobox";
import { UserStateType, useUserState } from "@/store/store";

function UserPreferences({ dbUser }: { dbUser: UserStateType }) {
  const { setUser } = useUserState();

  useEffect(() => {
    dbUser &&
      setUser({
        currency: dbUser.currency,
        isPro: false,
      });
  }, [dbUser]);

  return (
    <div className="flex justify-center">
      <div className="flex items-center space-x-2">
        <p>Default currency</p>
        <CurrencyCombobox />
      </div>
    </div>
  );
}

export default UserPreferences;
