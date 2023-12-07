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
    await db.asset.delete({
      where: {
        id: assetId,
      },
      include: {
        incomes: true,
        costs: true,
      },
    });
  }

  if (type == "income" && itemId) {
    await db.income
      .delete({
        where: {
          id: itemId,
        },
      })
      .catch((e) => {
        return Response.json({ code: "NOT FOUND" }, { status: 404 });
      });
  }

  if (type == "cost" && itemId) {
    await db.cost
      .delete({
        where: {
          id: itemId,
        },
      })
      .catch((e) => {
        return Response.json({ code: "NOT FOUND" }, { status: 404 });
      });
  }

  return Response.json({ success: true });
}
