import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// ลบสมาชิก
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.subscriptions.delete({
      where: { id: Number(params.id) },
    })
    return NextResponse.json({ message: "Deleted" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}

// อัปเดตสมาชิก (ตัวอย่าง: แก้ชื่อ)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const updated = await prisma.subscriptions.update({
      where: { id: Number(params.id) },
      data: body,
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
