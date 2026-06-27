import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      global: {
        headers: {
          cookie: request.cookies.toString(),
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to auth if not authenticated and trying to access protected routes
  if (!user && (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/loja'))) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth'
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to home if authenticated and trying to access auth
  if (user && request.nextUrl.pathname === '/auth') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/loja'
    return NextResponse.redirect(redirectUrl)
  }

  return response
}
