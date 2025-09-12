// app/api/update-status/route.ts
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  const now = new Date()
  await prisma.subscriptions.updateMany({
    where: {
      endDate: { lt: now },
      status: "Active",
    },
    data: { status: "Expired" },
  })

  return NextResponse.json({ message: "Status updated", time: now })
}
