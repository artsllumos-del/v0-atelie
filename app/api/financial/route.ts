import { NextRequest, NextResponse } from 'next/server'
import { getFinancialTransactions, createFinancialTransaction, getFinancialSummary } from '@/lib/supabase/financial'

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get('type')
    const category = req.nextUrl.searchParams.get('category')
    const startDate = req.nextUrl.searchParams.get('startDate')
    const endDate = req.nextUrl.searchParams.get('endDate')

    const transactions = await getFinancialTransactions({ type, category, startDate, endDate })
    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const transaction = await createFinancialTransaction(body)
    return NextResponse.json(transaction)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const summary = await getFinancialSummary()
    return NextResponse.json(summary)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 })
  }
}
