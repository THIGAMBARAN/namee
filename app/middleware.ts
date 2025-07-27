import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect vendor routes
  if (req.nextUrl.pathname.startsWith("/vendor")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (profile?.role !== "vendor") {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }
  }

  // Protect supplier routes
  if (req.nextUrl.pathname.startsWith("/supplier")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (profile?.role !== "supplier") {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/vendor/:path*", "/supplier/:path*"],
}
