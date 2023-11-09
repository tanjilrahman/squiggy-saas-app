import DashboardBody from "@/app/dashboard/components/DashboardBody"
import MenuBar from "@/app/dashboard/components/MenuBar"

function Dashboard() {
    return (
        <div>
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <MenuBar />
                </div>

                <DashboardBody />
            </div>
        </div>
    )
}

export default Dashboard