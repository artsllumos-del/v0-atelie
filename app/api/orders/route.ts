import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customer_id')

    let query = supabase
      .from('orders')
      .select(`
        *,
        customers (full_name, email),
        order_items (
          product_id,
          description,
          quantity,
          unit_price,
          total_value
        ),
        order_stages (*)
      `)
      .order('created_at', { ascending: false })

    if (customerId) {
      query = query.eq('customer_id', customerId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { items, stages, ...orderData } = body

    // Gerar número único de pedido
    const orderNumber = `PED-${Date.now()}`

    const { data: orderResult, error: orderError } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        order_number: orderNumber,
        created_by: user.id,
      })
      .select()

    if (orderError) throw orderError

    const order = orderResult[0]

    // Inserir itens do pedido
    if (items && items.length > 0) {
      const itemRecords = items.map((item: any) => ({
        order_id: order.id,
        ...item,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemRecords)

      if (itemsError) throw itemsError
    }

    // Inserir etapas de produção
    if (stages && stages.length > 0) {
      const stageRecords = stages.map((stage: any, index: number) => ({
        order_id: order.id,
        ...stage,
        stage_order: index,
      }))

      const { error: stagesError } = await supabase
        .from('order_stages')
        .insert(stageRecords)

      if (stagesError) throw stagesError
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
