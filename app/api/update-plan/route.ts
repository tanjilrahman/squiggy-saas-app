import { Plan } from "@/app/dashboard/tables/plans/data/schema";
import { db } from "@/db";
import { auth } from "@clerk/nextjs";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = auth();
  const updatedPlan: Plan = await request.json();

  if (!userId) return Response.json({ code: "UNAUTHORIZED" }, { status: 401 });

  // Fetch the existing plan
  const existingPlan = await db.plan.findUnique({
    where: {
      id: updatedPlan.id,
    },
  });

  if (existingPlan) {
    // Update existing plan
    await db.plan.update({
      where: {
        id: updatedPlan.id,
      },
      data: {
        id: updatedPlan.id,
        name: updatedPlan.name,
        inflation: updatedPlan.inflation,
        inflation_advanced: updatedPlan.inflation_advanced,
        inflation_mode: updatedPlan.inflation_mode,
        note: updatedPlan.note,
        status: updatedPlan.status,
        actions: {
          upsert: updatedPlan.actions.map((action) => ({
            where: { id: action.id },
            update: {
              name: action.name,
              time: action.time,
              value: action.value,
              status: action.status,
              assetOut: action.assetOut,
              assetsIn: action.assetsIn,
            },
            create: {
              name: action.name,
              time: action.time,
              value: action.value,
              status: action.status,
              assetOut: action.assetOut,
              assetsIn: action.assetsIn,
            },
          })),
        },
      },
    });
  } else {
    // Create new plan with associated actions, assetsIn, and assetOuts
    const createdPlan = await db.plan.create({
      data: {
        User: {
          connect: {
            id: userId,
          },
        },
        id: updatedPlan.id,
        name: updatedPlan.name,
        inflation: updatedPlan.inflation,
        inflation_advanced: updatedPlan.inflation_advanced,
        inflation_mode: updatedPlan.inflation_mode,
        note: updatedPlan.note,
        status: updatedPlan.status,
        actions: {
          create: updatedPlan.actions.map((action) => ({
            id: action.id,
            name: action.name,
            time: action.time,
            value: action.value,
            status: action.status,
            assetOut: action.assetOut,
            assetsIn: action.assetsIn,
          })),
        },
      },
    });
  }

  return Response.json({ success: true });
}
