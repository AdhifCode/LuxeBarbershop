import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run the auth/session middleware on everything EXCEPT:
     * - /api/*           (public + protected APIs handle their own auth)
     * - /_next/static    (build assets)
     * - /_next/image     (image optimizer)
     * - /favicon.ico
     * - any image / font request by extension
     */
    "/((?!api/|_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
