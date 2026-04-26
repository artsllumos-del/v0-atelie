import { NextRequest, NextResponse } from 'next/server'
import { getCollaborators, createCollaborator, updateCollaborator, deleteCollaborator } from '@/lib/supabase/collaborators'

export async function GET(req: NextRequest) {
  try {
    const role = req.nextUrl.searchParams.get('role')
    const department = req.nextUrl.searchParams.get('department')
    
    const collaborators = await getCollaborators({ role, department })
    return NextResponse.json(collaborators)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch collaborators' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const collaborator = await createCollaborator(body)
    return NextResponse.json(collaborator)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create collaborator' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const collaborator = await updateCollaborator(body.id, body.updates)
    return NextResponse.json(collaborator)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update collaborator' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    
    await deleteCollaborator(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete collaborator' }, { status: 500 })
  }
}
