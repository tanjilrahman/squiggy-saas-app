import { db } from "@/db";
import { UserStateType } from "@/store/store";
import { auth } from "@clerk/nextjs";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = auth();
  const updatedPreference: UserStateType = await request.json();

  if (!userId) return Response.json({ code: "UNAUTHORIZED" }, { status: 401 });

  // Check if the user have this asset

  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      currency: updatedPreference.currency,
    },
  });

  return Response.json({ success: true });
}
