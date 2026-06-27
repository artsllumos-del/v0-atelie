import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_materials (
          quantity_required,
          materials (*)
        )
      `)
      .order('created_at', { ascending: false })

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
    const { materials, ...productData } = body

    const { data: productResult, error: productError } = await supabase
      .from('products')
      .insert(productData)
      .select()

    if (productError) throw productError

    const product = productResult[0]

    // Inserir materiais associados ao produto
    if (materials && materials.length > 0) {
      const materialRecords = materials.map((m: any) => ({
        product_id: product.id,
        material_id: m.material_id,
        quantity_required: m.quantity_required,
      }))

      const { error: materialsError } = await supabase
        .from('product_materials')
        .insert(materialRecords)

      if (materialsError) throw materialsError
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
