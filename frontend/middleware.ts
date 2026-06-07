import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // No auth — all routes publicly accessible
  return;
}

export const config = {
  matcher: [],
};
