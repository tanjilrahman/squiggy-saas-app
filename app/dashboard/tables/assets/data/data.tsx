import {
  CircleIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { Banknote, Building, LineChart } from "lucide-react";

export const categories = [
  {
    value: "real estate",
    label: "Real Estate",
    icon: Building,
  },
  {
    value: "stocks",
    label: "Stocks",
    icon: LineChart,
  },
  {
    value: "bonds",
    label: "Bonds",
    icon: Banknote,
  },
];

export const types = [
  {
    value: "passive",
    label: "Passive",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "active",
    label: "Active",
    icon: CircleIcon,
  },
  {
    value: "sustain",
    label: "Sustain",
    icon: StopwatchIcon,
  },
];
