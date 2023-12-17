import { useUserState } from "@/store/store";
import React from "react";

type CurrencyType = {
  number: number | null | undefined;
};

export const FormatValueCurrency = ({ number }: CurrencyType) => {
  const { user } = useUserState();

  const formattedValue = (number: number | null | undefined) => {
    return `${new Intl.NumberFormat("us")
      .format(number || 0)
      .toString()} ${user?.currency.toUpperCase()}`;
  };

  return <span>{formattedValue(number)}</span>;
};
