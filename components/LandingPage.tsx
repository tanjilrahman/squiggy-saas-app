import Image from "next/image";
import thumb from "@/images/hero-image-2.png";
import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="relative">
      {/* Illustration behind hero content */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -z-1"
        aria-hidden="true"
      >
        {/* <svg
          width="1360"
          height="578"
          viewBox="0 0 1360 578"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="illustration-01"
            >
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="url(#illustration-01)" fillRule="evenodd">
            <circle cx="1232" cy="128" r="128" />
            <circle cx="155" cy="443" r="64" />
          </g>
        </svg> */}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Hero content */}
        <div className="pt-11 pb-8 md:pt-16 md:pb-">
          {/* Section header */}
          <div className="text-center pb-12 md:pb-16">
            <h1
              className="text-6xl md:text-7xl font-extrabold leading-tighter tracking-tighter mb-4"
              data-aos="zoom-y-out"
            >
              Empower Your{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                Family’s Financial Future
              </span>
            </h1>
            <div className="max-w-3xl mx-auto">
              <p
                className="text-lg text-gray-600 mb-8"
                data-aos="zoom-y-out"
                data-aos-delay="150"
              >
                Start your journey with our easy-to-use tools that bring clarity
                to your finances. Sign up now and take the first step towards a
                secure and prosperous tomorrow.
              </p>
              <div
                className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center space-x-3"
                data-aos="zoom-y-out"
                data-aos-delay="300"
              >
                <div>
                  <a
                    className="btn text-white bg-blue-700 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0 px-5 py-3 rounded-lg"
                    href="/sign-up"
                  >
                    Get Started
                  </a>
                </div>
                <div>
                  <a
                    className="btn text-gray-300 ring-2 ring-gray-300 bg-transparent hover:bg-white w-full mb-4 sm:w-auto sm:mb-0 px-5 py-3 rounded-lg"
                    href="/sign-up"
                  >
                    Sign in
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div
              className="relative flex justify-center mb-8"
              data-aos="zoom-y-out"
              data-aos-delay="450"
            >
              <div className="flex flex-col justify-center">
                <Image
                  src={thumb}
                  width={1920}
                  height={1080}
                  alt="Hero Image"
                />
              </div>
              <Link href="/sign-up" className="absolute top-full">
                <button className=" flex items-center text-gray-500 transform -translate-y-1/2 bg-white rounded-full font-medium group p-4 shadow-lg">
                  <svg
                    className="w-6 h-6 fill-current text-gray-400 group-hover:text-blue-600 shrink-0"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0 2C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12z" />
                    <path d="M10 17l6-5-6-5z" />
                  </svg>
                  <span className="ml-3">Try it for free</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
