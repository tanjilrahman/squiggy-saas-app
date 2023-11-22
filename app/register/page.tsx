import PricingCards from "@/components/PricingCards";
import { currentUser } from "@clerk/nextjs";
import React from "react";

async function Register() {
  const user = await currentUser();
  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
        <h2 className="mb-5 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          Lets handle your Membership {user?.firstName}
        </h2>
      </div>
      <PricingCards redirect={false} />
    </div>
  );
}

export default Register;
