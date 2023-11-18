import {
  CircleIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import {
  Banknote,
  Briefcase,
  Building,
  CarFront,
  LandPlot,
  ShieldPlus,
  Shirt,
} from "lucide-react";

export const categories = [
  {
    value: "real estate",
    label: "Real Estate",
    icon: Building,
  },
  {
    value: "securities",
    label: "Securities",
    icon: ShieldPlus,
  },
  {
    value: "currency",
    label: "Currency",
    icon: Banknote,
  },
  {
    value: "job",
    label: "Job",
    icon: Briefcase,
  },
  {
    value: "movables",
    label: "Movables",
    icon: CarFront,
  },
  {
    value: "lifestyle",
    label: "Lifestyle",
    icon: Shirt,
  },
  {
    value: "others",
    label: "Others",
    icon: LandPlot,
  },
];

export const IncomeTypes = [
  {
    value: "passive",
    label: "Passive",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "mixed",
    label: "Mixed",
    icon: CircleIcon,
  },
  {
    value: "active",
    label: "Active",
    icon: StopwatchIcon,
  },
];

export const CostTypes = [
  {
    value: "sustain",
    label: "Sustain",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "invest",
    label: "Invest",
    icon: CircleIcon,
  },
  {
    value: "seed",
    label: "Seed",
    icon: StopwatchIcon,
  },
];
