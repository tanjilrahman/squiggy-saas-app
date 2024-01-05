import { db } from "@/db";
import { auth } from "@clerk/nextjs";
import { NextRequest } from "next/server";

type RequestType = {
  actionAssetId: string;
  assetId: string;
};

export async function POST(request: NextRequest) {
  const { userId } = auth();
  const { actionAssetId, assetId }: RequestType = await request.json();

  if (!userId) return Response.json({ code: "UNAUTHORIZED" }, { status: 401 });

  await db.actionAsset
    .delete({
      where: {
        id: actionAssetId,
      },
    })
    .catch((e) => {
      return Response.json({ code: "NOT FOUND" }, { status: 404 });
    });

  // Delete associated asset
  if (assetId) {
    await db.asset
      .delete({
        where: {
          id: assetId,
        },
        include: {
          incomes: true,
          costs: true,
        },
      })
      .catch((e) => {
        return Response.json({ code: "NOT FOUND" }, { status: 404 });
      });
  }

  return Response.json({ success: true });
}
