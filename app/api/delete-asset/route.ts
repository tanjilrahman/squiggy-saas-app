import { db } from "@/db";
import { auth } from "@clerk/nextjs";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = auth();
  const { assetId, type, itemId } = await request.json();

  if (!userId) return Response.json({ code: "UNAUTHORIZED" }, { status: 401 });

  // Check if the user have this asset

  const hasAsset = await db.user.findFirst({
    where: {
      id: userId,
      assets: {
        some: {
          id: assetId,
        },
      },
    },
  });

  if (!hasAsset) return Response.json({ code: "NOT FOUND" }, { status: 404 });

  if (assetId) {
    await db.income.deleteMany({
      where: {
        Asset: {
          id: assetId,
        },
      },
    });
    await db.cost.deleteMany({
      where: {
        Asset: {
          id: assetId,
        },
      },
    });
    await db.asset.delete({
      where: {
        id: assetId,
      },
    });
  }

  if (type == "income" && itemId) {
    const hasIncome = await db.income.findFirst({
      where: {
        id: itemId,
      },
    });
    if (!hasIncome)
      return Response.json({ code: "NOT FOUND" }, { status: 404 });

    await db.income.delete({
      where: {
        id: itemId,
      },
    });
  }

  if (type == "cost" && itemId) {
    const hasCost = await db.cost.findFirst({
      where: {
        id: itemId,
      },
    });
    if (!hasCost) return Response.json({ code: "NOT FOUND" }, { status: 404 });
    await db.cost.delete({
      where: {
        id: itemId,
      },
    });
  }

  return Response.json({ success: true });
}
