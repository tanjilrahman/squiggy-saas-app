import { db } from "@/db";
import { auth } from "@clerk/nextjs";
import { NextRequest } from "next/server";

type RequestType = {
  planId: string;
  type: string;
  itemId: string;
  assetIds: string[];
};

export async function POST(request: NextRequest) {
  const { userId } = auth();
  const { planId, type, itemId, assetIds }: RequestType = await request.json();

  if (!userId) return Response.json({ code: "UNAUTHORIZED" }, { status: 401 });

  // Check if the user has this plan

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
    await db.plan
      .delete({
        where: {
          id: planId,
        },
      })
      .catch((e) => {
        return Response.json({ code: "NOT FOUND" }, { status: 404 });
      });

    // Delete associated assets
    if (assetIds) {
      await db.asset
        .deleteMany({
          where: {
            id: { in: assetIds },
          },
        })
        .catch((e) => {
          return Response.json({ code: "NOT FOUND" }, { status: 404 });
        });
    }
  }

  if (type === "action") {
    await db.action
      .delete({
        where: {
          id: itemId,
        },
      })
      .catch((e) => {
        return Response.json({ code: "NOT FOUND" }, { status: 404 });
      });

    // Delete associated assets
    if (assetIds) {
      await db.asset
        .deleteMany({
          where: {
            id: { in: assetIds },
          },
        })
        .catch((e) => {
          return Response.json({ code: "NOT FOUND" }, { status: 404 });
        });
    }
  }

  return Response.json({ success: true });
}
