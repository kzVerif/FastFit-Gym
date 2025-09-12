import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET: ดึงข้อมูลทั้งหมด
export async function GET() {
  try {
    const res = await prisma.subscriptions.findMany()
    return NextResponse.json(res, { status: 200 })
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST: เพิ่มสมาชิกใหม่
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone, startDate, endDate } = body

    if (!name || !phone || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const newUser = await prisma.subscriptions.create({
      data: {
        name,
        tell: phone, // map ฟิลด์ phone จากฟอร์ม → tell ใน DB
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: "Active", // default Active
      },
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error("Error creating subscription:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
