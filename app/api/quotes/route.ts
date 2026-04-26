import { NextRequest, NextResponse } from 'next/server'
import { getQuotes, createQuote, updateQuote, getQuotesByStatus } from '@/lib/supabase/quotes'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const quote = await createQuote(body)
    return NextResponse.json(quote)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get('status')
    if (status) {
      const quotes = await getQuotesByStatus(status)
      return NextResponse.json(quotes)
    }
    const quotes = await getQuotes()
    return NextResponse.json(quotes)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const quote = await updateQuote(body.id, body.updates)
    return NextResponse.json(quote)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 })
  }
}
