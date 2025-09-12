import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import type { NextRequest } from "next/server"

const prisma = new PrismaClient()

type RouteContext = {
  params: { id: string }
}

// ลบสมาชิก
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = context.params
    await prisma.subscriptions.delete({
      where: { id: Number(id) },
    })
    return NextResponse.json({ message: "Deleted" }, { status: 200 })
  } catch (error) {
    console.error("DELETE Error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}

// อัปเดตสมาชิก
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = context.params
    const body = await req.json()

    const updated = await prisma.subscriptions.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
        tell: body.tell,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        status: body.status,
      },
    })

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    console.error("PUT Error:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
