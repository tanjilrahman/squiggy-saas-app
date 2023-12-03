import { db } from "@/db";
import { auth } from "@clerk/nextjs";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = auth();
  const { planId, type, itemId } = await request.json();

  if (!userId) return Response.json({ code: "UNAUTHORIZED" }, { status: 401 });

  // Check if the user have this asset

  const hasPlan = await db.user.findFirst({
    where: {
      id: userId,
      plans: {
        some: {
          id: planId,
        },
      },
    },
  });

  if (!hasPlan) return Response.json({ code: "NOT FOUND" }, { status: 404 });

  if (planId) {
    await db.plan.delete({
      where: {
        id: planId,
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
  if (type === "action" && itemId) {
    await db.action.delete({
      where: {
        id: itemId,
      },
      include: {
        assetIns: true,
        assetOuts: true,
      },
    });
  }

  return Response.json({ success: true });
}
