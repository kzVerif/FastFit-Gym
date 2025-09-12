import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import type { NextRequest } from "next/server"

const prisma = new PrismaClient()

// ✅ GET: ดึงข้อมูลสมาชิกตาม id
// @ts-ignore
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.subscriptions.findUnique({
      where: { id: Number(params.id) },
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
// @ts-ignore
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    // ✅ สร้างวันที่จาก body
    const startDate = body.startDate ? new Date(body.startDate) : undefined;
    const endDate = body.endDate ? new Date(body.endDate) : undefined;

    // ✅ logic เช็คสถานะ
    let status = body.status;
    if (endDate) {
      const now = new Date();
      status = now > endDate ? "expired" : "active";
    }

    const updated = await prisma.subscriptions.update({
      where: { id: Number(params.id) },
      data: {
        name: body.name,
        tell: body.tell,
        startDate,
        endDate,
        status,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ✅ DELETE: ลบข้อมูลสมาชิก
export async function DELETE(
  _req: NextRequest,
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