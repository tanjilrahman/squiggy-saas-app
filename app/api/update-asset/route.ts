import { Asset, IncomeCost } from "@/app/dashboard/tables/assets/data/schema";
import { db } from "@/db";
import { auth } from "@clerk/nextjs";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = auth();
  const updatedAsset: Asset = await request.json();

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
        action_asset: updatedAsset?.action_asset,
        name: updatedAsset?.name,
        value: updatedAsset?.value,
        category: updatedAsset?.category,
        yoy: updatedAsset?.yoy,
        profit: updatedAsset?.profit,
        roi: updatedAsset?.roi,
        note: updatedAsset?.note!,
        allocation: updatedAsset?.allocation,
        yoy_advanced: updatedAsset?.yoy_advanced.map((value) => value ?? 0),
        yoy_mode: updatedAsset?.yoy_mode,
        yoy_type: updatedAsset?.yoy_type,
        incomes: {
          upsert: updatedAsset?.incomes.map((income) => ({
            where: { id: income.id },
            update: {
              id: income.id,
              name: income.name!,
              type: income?.type,
              value: income?.value,
              yoy: income?.yoy,
              yoy_advanced: income?.yoy_advanced.map((value) => value ?? 0),
              yoy_mode: income?.yoy_mode,
              yoy_type: income?.yoy_type,
              value_mode: income?.value_mode,
            },
            create: {
              id: income.id,
              name: income.name!,
              type: income?.type,
              value: income?.value,
              yoy: income?.yoy,
              yoy_advanced: income?.yoy_advanced.map((value) => value ?? 0),
              yoy_mode: income?.yoy_mode,
              yoy_type: income?.yoy_type,
              value_mode: income?.value_mode,
            },
          })),
        },
        costs: {
          upsert: updatedAsset?.costs.map((cost) => ({
            where: { id: cost.id },
            update: {
              id: cost.id,
              name: cost.name!,
              type: cost?.type,
              value: cost?.value,
              yoy: cost?.yoy,
              yoy_advanced: cost?.yoy_advanced.map((value) => value ?? 0),
              yoy_mode: cost?.yoy_mode,
              yoy_type: cost?.yoy_type,
              value_mode: cost?.value_mode,
            },
            create: {
              id: cost.id,
              name: cost.name!,
              type: cost?.type,
              value: cost?.value,
              yoy: cost?.yoy,
              yoy_advanced: cost?.yoy_advanced.map((value) => value ?? 0),
              yoy_mode: cost?.yoy_mode,
              yoy_type: cost?.yoy_type,
              value_mode: cost?.value_mode,
            },
          })),
        },
      },
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
        action_asset: updatedAsset?.action_asset,
        name: updatedAsset?.name,
        value: updatedAsset?.value,
        category: updatedAsset?.category,
        yoy: updatedAsset?.yoy,
        profit: updatedAsset?.profit!,
        roi: updatedAsset?.roi!,
        note: updatedAsset?.note || "",
        allocation: updatedAsset?.allocation,
        yoy_advanced: updatedAsset?.yoy_advanced.map((value) => value ?? 0),
        yoy_mode: updatedAsset?.yoy_mode,
        yoy_type: updatedAsset?.yoy_type,
        incomes: {
          create: updatedAsset?.incomes.map((income) => ({
            id: income.id,
            name: income.name!,
            type: income?.type,
            value: income?.value,
            yoy: income?.yoy,
            yoy_advanced: income?.yoy_advanced.map((value) => value ?? 0),
            yoy_mode: income?.yoy_mode,
            yoy_type: income?.yoy_type,
            value_mode: income?.value_mode,
          })),
        },
        costs: {
          create: updatedAsset?.costs.map((cost) => ({
            id: cost.id,
            name: cost.name!,
            type: cost?.type,
            value: cost?.value,
            yoy: cost?.yoy,
            yoy_advanced: cost?.yoy_advanced.map((value) => value ?? 0),
            yoy_mode: cost?.yoy_mode,
            yoy_type: cost?.yoy_type,
            value_mode: cost?.value_mode,
          })),
        },
      },
    });
  }

  return Response.json({ success: true });
}
