import { IncomeCost } from "@/app/dashboard/tables/assets/data/schema";
import { db } from "@/db";
import { auth } from "@clerk/nextjs";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = auth();
  const updatedAsset = await request.json();

  if (!userId) return Response.json({ code: "UNAUTHORIZED" }, { status: 401 });

  // Check if the user have this asset

  const hasAsset = await db.user.findFirst({
    where: {
      id: userId,
      assets: {
        some: {
          id: updatedAsset.id,
        },
      },
    },
  });

  if (hasAsset) {
    await db.asset.update({
      where: {
        id: updatedAsset.id,
      },
      data: {
        name: updatedAsset?.name,
        value: updatedAsset?.value,
        category: updatedAsset?.category,
        yoy: updatedAsset?.yoy,
        profit: updatedAsset?.profit,
        roi: updatedAsset?.roi,
        note: updatedAsset?.note,
        yoy_advanced: updatedAsset?.yoy_advanced,
        yoy_mode: updatedAsset?.yoy_mode,
        yoy_type: updatedAsset?.yoy_type,
      },
    });

    updatedAsset?.incomes.map(async (income: IncomeCost) => {
      const hasIncome = await db.income.findFirst({
        where: {
          assetId: updatedAsset.id,
          id: income.id,
        },
      });

      if (hasIncome) {
        // update if its an existing income

        await db.income.update({
          where: {
            assetId: updatedAsset.id,
            id: income.id,
          },
          data: income,
        });
      } else {
        // create if its a new income

        await db.income.create({
          data: {
            Asset: {
              connect: {
                id: updatedAsset.id,
              },
            },
            id: income.id,
            name: income.name!,
            type: income?.type,
            value: income?.value,
            yoy: income.yoy!,
            yoy_advanced: income?.yoy_advanced,
            yoy_mode: income?.yoy_mode,
            yoy_type: income?.yoy_type,
            value_mode: income?.value_mode,
          },
        });
      }
    });

    updatedAsset?.costs.map(async (cost: IncomeCost) => {
      const hasCost = await db.cost.findFirst({
        where: {
          assetId: updatedAsset.id,
          id: cost.id,
        },
      });

      if (hasCost) {
        // update if its an existing cost

        await db.cost.update({
          where: {
            assetId: updatedAsset.id,
            id: cost.id,
          },
          data: cost,
        });
      } else {
        // create if its a new cost

        await db.cost.create({
          data: {
            Asset: {
              connect: {
                id: updatedAsset.id,
              },
            },
            id: cost.id,
            name: cost.name!,
            type: cost?.type,
            value: cost?.value,
            yoy: cost.yoy!,
            yoy_advanced: cost?.yoy_advanced,
            yoy_mode: cost?.yoy_mode,
            yoy_type: cost?.yoy_type,
            value_mode: cost?.value_mode,
          },
        });
      }
    });
  }

  // create a new asset

  if (!hasAsset) {
    const createdAsset = await db.asset.create({
      data: {
        User: {
          connect: {
            id: userId,
          },
        },
        id: updatedAsset?.id,
        name: updatedAsset?.name,
        value: updatedAsset?.value,
        category: updatedAsset?.category,
        yoy: updatedAsset?.yoy,
        profit: updatedAsset?.profit,
        roi: updatedAsset?.roi,
        note: updatedAsset?.note || "",
        yoy_advanced: updatedAsset?.yoy_advanced,
        yoy_mode: updatedAsset?.yoy_mode,
        yoy_type: updatedAsset?.yoy_type,
      },
    });

    await Promise.all(
      updatedAsset?.incomes.map(async (income: IncomeCost) => {
        await db.income.create({
          data: {
            Asset: {
              connect: {
                id: createdAsset.id,
              },
            },
            id: income.id,
            name: income.name!,
            type: income?.type,
            value: income?.value,
            yoy: income.yoy!,
            yoy_advanced: income?.yoy_advanced,
            yoy_mode: income?.yoy_mode,
            yoy_type: income?.yoy_type,
            value_mode: income?.value_mode,
          },
        });
      })
    );

    await Promise.all(
      updatedAsset?.costs.map(async (cost: IncomeCost) => {
        await db.cost.create({
          data: {
            Asset: {
              connect: {
                id: createdAsset.id,
              },
            },
            id: cost.id,
            name: cost.name!,
            type: cost?.type,
            value: cost?.value,
            yoy: cost.yoy!,
            yoy_advanced: cost?.yoy_advanced,
            yoy_mode: cost?.yoy_mode,
            yoy_type: cost?.yoy_type,
            value_mode: cost?.value_mode,
          },
        });
      })
    );
  }

  return Response.json({ success: true });
}
