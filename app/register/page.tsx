import { authOptions } from '@/auth'
import PricingCards from '@/components/PricingCards';
import { getServerSession } from 'next-auth'
import React from 'react'

async function Register() {
    const session = await getServerSession(authOptions);
    return (
        <div className="bg-white dark:bg-gray-900">

            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <h2 className="mb-5 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Lets handle your Membership {session?.user?.name?.split(" ")?.[0]}</h2>
                </div>
                <PricingCards redirect={false} />
            </div>
        </div>
    )
}

export default Register