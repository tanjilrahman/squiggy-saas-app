"use client"

import React from 'react'
import Plans from "@/app/dashboard/components/Plans"
import Review from "@/app/dashboard/components/Review"
import Assets from "@/app/dashboard/components/Assets"
import { useNavState } from "@/store/store"


function DashboardBody() {
    const { nav } = useNavState()
    return (
        <div className="mx-auto">
            {nav == "assets" && (
                <Assets />
            )}

            {nav == "plans" && (
                <Plans />
            )}

            {nav == "review" && (
                <Review />
            )}
        </div>
    )
}

export default DashboardBody