"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavState } from "@/store/store"

import React from 'react'

function MenuBar() {
    const { setNav } = useNavState()
    return (
        <Tabs defaultValue="assets" className="">
            <TabsList>
                <TabsTrigger value="review" onClick={() => setNav('review')}>Review</TabsTrigger>
                <TabsTrigger value="assets" onClick={() => setNav('assets')}>Assets</TabsTrigger>
                <TabsTrigger value="plans" onClick={() => setNav('plans')}>Plans</TabsTrigger>

            </TabsList>
        </Tabs>

    )
}

export default MenuBar
