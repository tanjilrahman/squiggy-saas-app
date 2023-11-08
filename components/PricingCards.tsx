import Link from 'next/link'
import { CheckIcon } from "lucide-react"
import CheckoutButton from './CheckoutButton'

const tiers = [
    {
        name: "Free",
        id: null,
        href: "#",
        priceMonthly: '$0',
        description: "Try out core functionalities with some limitations!",
        features: [
            "3 Assets",
            "5 Income & Costs",
            "1 Plan",
            "2 Actions"
        ]
    },
    {
        name: "Core",
        id: "dfajslfjad",
        href: "#",
        priceMonthly: "$99",
        description: "Try out core functionalities with some limitations!",
        features: [
            "Unlimited users",
            "Nice support",
            "Useful updates",
            "Cool features"
        ]
    },
    {
        name: "Pro",
        id: null,
        href: "#",
        priceMonthly: "$$",
        description: "Try out core functionalities with some limitations!",
        features: [
            "Unlimited users",
            "Nice support",
            "Useful updates",
            "Cool features"
        ]
    }
]

function PricingCards({ redirect }: { redirect: boolean }) {
    return (

        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
            {/* <!-- Pricing Card --> */}
            {tiers.map(tier => (
                <div key={tier.id} className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                    <h3 className="mb-4 text-2xl font-semibold">{tier.name}</h3>
                    <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">{tier.description}</p>
                    <div className="flex justify-center items-baseline my-8">
                        <span className="mr-2 text-5xl font-extrabold">{tier.priceMonthly}</span>
                        <span className="text-gray-500 dark:text-gray-400">/month</span>
                    </div>
                    {/* <!-- List --> */}


                    <ul role="list" className="mb-8 space-y-4 text-left">
                        {tier.features.map((feature, i) => (
                            <li key={i} className="flex items-center space-x-3">
                                {/* <!-- Icon --> */}
                                <CheckIcon className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {redirect ? (
                        <Link href='/register' className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-indigo-900">Get started</Link>
                    ) : (
                        tier.id && <CheckoutButton />
                    )}


                </div>
            ))}
        </div>
    )
}

export default PricingCards