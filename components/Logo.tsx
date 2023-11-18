import LogoText from "@logos/logotext.png";
import LogoImage from "@logos/logo.png";
import Link from "next/link";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center w-60 h-12">
      <AspectRatio ratio={16 / 9} className="flex items-center justify-center">
        <div className="flex space-x-2 items-center">
          <Image
            priority
            src={LogoImage}
            alt="Logo"
            className="rounded-full w-12 h-12 object-contain"
          />
          <Image
            priority
            src={LogoText}
            alt="Logo text"
            className="rounded-full dark:filter dark:invert w-40 h-12 object-contain"
          />
        </div>
      </AspectRatio>
    </div>
  );
};

export default Logo;
