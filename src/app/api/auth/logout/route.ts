import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  await clearSessionCookie();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const redirectUrl = siteUrl ? new URL("/", siteUrl) : new URL("/", request.url);
  return NextResponse.redirect(redirectUrl);
}
