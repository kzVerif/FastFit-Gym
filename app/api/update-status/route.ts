import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import type { NextRequest } from "next/server"

const prisma = new PrismaClient()

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()

    const updated = await prisma.subscriptions.update({
      where: { id: Number(params.id) }, // ❌ ไม่ต้อง await เพราะ params ไม่ใช่ Promise
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
