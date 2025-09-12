import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// ✅ GET: ดึงข้อมูลสมาชิกตาม id
export async function GET(
  request: Request,
  { params }: { params: any }
) {
  try {
    // รองรับทั้ง sync และ async params
    const resolvedParams = await Promise.resolve(params)
    const { id } = resolvedParams
    
    const user = await prisma.subscriptions.findUnique({
      where: { id: Number(id) },
    })

    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error("GET Error:", error)
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 })
  }
}

// ✅ PUT: อัปเดตข้อมูลสมาชิก
export async function PUT(
  request: Request,
  { params }: { params: any }
) {
  try {
    // รองรับทั้ง sync และ async params
    const resolvedParams = await Promise.resolve(params)
    const { id } = resolvedParams
    const body = await request.json()

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

// ✅ DELETE: ลบข้อมูลสมาชิก
export async function DELETE(
  request: Request,
  { params }: { params: any }
) {
  try {
    // รองรับทั้ง sync และ async params
    const resolvedParams = await Promise.resolve(params)
    const { id } = resolvedParams
    
    await prisma.subscriptions.delete({
      where: { id: Number(id) },
    })

    return NextResponse.json({ message: "Deleted" }, { status: 200 })
  } catch (error) {
    console.error("DELETE Error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}