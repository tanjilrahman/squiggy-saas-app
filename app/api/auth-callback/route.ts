import { db } from "@/db";
import { auth, currentUser } from "@clerk/nextjs";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId) return Response.json({ code: "UNAUTHORIZED" }, { status: 401 });

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser && user) {
    await db.user.create({
      data: {
        id: userId,
        email: user?.emailAddresses[0].emailAddress,
      },
    });
  }

  return Response.json({ success: true });
}
