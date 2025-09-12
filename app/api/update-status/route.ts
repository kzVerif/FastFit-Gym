import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import type { NextRequest } from "next/server"

const prisma = new PrismaClient()

// ลบสมาชิก
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.subscriptions.delete({
      where: { id: Number(params.id) },
    })
    return NextResponse.json({ message: "Deleted" }, { status: 200 })
  } catch (error) {
    console.error("DELETE Error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}

// อัปเดตสมาชิก
type RouteContext<T extends string> =
  T extends `/users/[${infer Param}]`
    ? { params: { [K in Param]: string } }
    : never

export async function PUT(
  req: NextRequest,
  { params }: RouteContext<"/users/[id]">
) {
  const body = await req.json()

  const updated = await prisma.subscriptions.update({
    where: { id: Number(params.id) },
    data: body,
  })

  return NextResponse.json(updated, { status: 200 })
}
