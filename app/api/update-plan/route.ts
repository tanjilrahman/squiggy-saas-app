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
              timeframe: action.timeframe,
              value: action.value,
              status: action.status,
              assetIns: {
                upsert: action.assetIns.map((assetIn) => ({
                  where: {
                    id: assetIn.id,
                  },
                  update: {
                    assetId: assetIn.assetId,
                    type: assetIn.type,
                    allocation: assetIn.allocation,
                  },
                  create: {
                    assetId: assetIn.assetId,
                    type: assetIn.type,
                    allocation: assetIn.allocation,
                  },
                })),
              },
              assetOuts: {
                upsert: action.assetOuts.map((assetOut) => ({
                  where: {
                    id: assetOut.id,
                  },
                  update: {
                    assetId: assetOut.assetId,
                    type: assetOut.type,
                    allocation: assetOut.allocation,
                  },
                  create: {
                    assetId: assetOut.assetId,
                    type: assetOut.type,
                    allocation: assetOut.allocation,
                  },
                })),
              },
            },
            create: {
              name: action.name,
              timeframe: action.timeframe,
              value: action.value,
              status: action.status,
              assetIns: {
                create: action.assetIns.map((assetIn) => ({
                  id: assetIn.id,
                  assetId: assetIn.assetId,
                  type: assetIn.type,
                  allocation: assetIn.allocation,
                })),
              },
              assetOuts: {
                create: action.assetOuts.map((assetOut) => ({
                  id: assetOut.id,
                  assetId: assetOut.assetId,
                  type: assetOut.type,
                  allocation: assetOut.allocation,
                })),
              },
            },
          })),
        },
      },
    });
  } else {
    // Create new plan with associated actions, assetIns, and assetOuts
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
            timeframe: action.timeframe,
            value: action.value,
            status: action.status,
            assetIns: {
              create: action.assetIns,
            },
            assetOuts: {
              create: action.assetOuts,
            },
          })),
        },
      },
      include: {
        actions: {
          include: {
            assetIns: true,
            assetOuts: true,
          },
        },
      },
    });
  }

  return Response.json({ success: true });
}
