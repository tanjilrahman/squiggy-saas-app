import LogoText from "@logos/logotext.png"
import LogoImage from "@logos/logo.png"
import Link from "next/link"
import { AspectRatio } from "./ui/aspect-ratio"
import Image from "next/image"

const Logo = () => {
  return (
    <Link href="/" prefetch={false} className="overflow-hidden">
        <div className="flex items-center w-96 h-16">
            <AspectRatio ratio={16 / 9} className="flex items-center justify-center">
                <div className="flex space-x-2 items-center">
                    <Image 
                        priority
                        src={LogoImage}
                        alt="Logo"
                        className="rounded-full"
                    />
                    <Image 
                        priority
                        src={LogoText}
                        alt="Logo text"
                        className="rounded-full dark:filter dark:invert"
                    />
                </div>
                
            </AspectRatio>
        </div>
    </Link>
  )
}

export default Logo