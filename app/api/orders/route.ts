import { NextRequest, NextResponse } from 'next/server'
import { createOrderItem, createOrder, getOrdersByStatus } from '@/lib/supabase/orders'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const order = await createOrder(body)
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get('status')
    if (status) {
      const orders = await getOrdersByStatus(status)
      return NextResponse.json(orders)
    }
    return NextResponse.json([])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
