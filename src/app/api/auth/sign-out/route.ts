import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { APIResponse } from "@/utils/types";
import { revokeAllSessions } from "@/db/firebaseAdmin";

export async function GET() {
  const sessionCookie = cookies().get("__session")?.value;

  if (!sessionCookie)
    return NextResponse.json<APIResponse<string>>({ success: false, error: "Session not found." }, { status: 400 });

  cookies().delete("__session");

  await revokeAllSessions(sessionCookie);

  return NextResponse.json<APIResponse<string>>({ success: true, data: "Signed out successfully." });
}