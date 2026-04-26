import { NextRequest, NextResponse } from 'next/server'
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '@/lib/supabase/cart'

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    
    const cart = await getCart(userId)
    return NextResponse.json(cart)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const item = await addToCart(body.userId, body.productId, body.quantity, body.customization)
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const item = await updateCartItem(body.id, body.updates)
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    
    await removeFromCart(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 })
  }
}
