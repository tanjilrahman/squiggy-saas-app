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
              assetsIn: {
                upsert: action.assetsIn.map((assetIn) => ({
                  where: { id: assetIn.id },
                  update: {
                    assetId: assetIn.assetId,
                    allocation: assetIn.allocation,
                    type: assetIn.type,
                  },
                  create: {
                    id: assetIn.id,
                    assetId: assetIn.assetId,
                    allocation: assetIn.allocation,
                    type: assetIn.type,
                  },
                })),
              },
              assetOut: action.assetOut
                ? {
                    upsert: {
                      where: { id: action.assetOut.id },
                      update: {
                        id: action.assetOut.id,
                        assetId: action.assetOut.assetId,
                        allocation: action.assetOut.allocation,
                        type: action.assetOut.type,
                      },
                      create: {
                        id: action.assetOut.id,
                        assetId: action.assetOut.assetId,
                        allocation: action.assetOut.allocation,
                        type: action.assetOut.type,
                      },
                    },
                  }
                : undefined,
            },
            create: {
              id: action.id,
              name: action.name,
              time: action.time,
              value: action.value,
              status: action.status,
              assetsIn: {
                create: action.assetsIn.map((assetIn) => ({
                  id: assetIn.id,
                  assetId: assetIn.assetId,
                  allocation: assetIn.allocation,
                  type: assetIn.type,
                })),
              },
              assetOut: action.assetOut
                ? {
                    create: {
                      id: action.assetOut.id,
                      assetId: action.assetOut.assetId,
                      allocation: action.assetOut.allocation,
                      type: action.assetOut.type,
                    },
                  }
                : undefined,
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
            assetsIn: {
              create: action.assetsIn.map((assetIn) => ({
                id: assetIn.id,
                assetId: assetIn.assetId,
                allocation: assetIn.allocation,
                type: assetIn.type,
              })),
            },
            assetOut: action.assetOut
              ? {
                  create: {
                    id: action.assetOut.id,
                    assetId: action.assetOut.assetId,
                    allocation: action.assetOut.allocation,
                    type: action.assetOut.type,
                  },
                }
              : undefined,
          })),
        },
      },
    });
  }

  return Response.json({ success: true });
}
