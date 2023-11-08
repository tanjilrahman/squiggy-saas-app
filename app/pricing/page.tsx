import PricingCards from "@/components/PricingCards";

function PricingPage() {
    return (
        <div className="bg-white dark:bg-gray-900">

            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <h2 className="mb-4 text-base font-semibold leading-7 text-indigo-400">Pricing</h2>
                    <h2 className="mb-5 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">The right price for you, whoever you are</h2>
                    <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">We are 99% sure we have a plan to match 100% of your needs!</p>
                </div>
                <PricingCards redirect={true} />
            </div>
        </div>
    )
}

export default PricingPage