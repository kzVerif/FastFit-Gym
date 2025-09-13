import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function DemoPage() {
  // ✅ เช็ค session ฝั่ง server
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login") // ถ้าไม่มี session → ไป login
  }

  const res = await fetch("https://fast-fit-gym.vercel.app/api/subscriptions", {
    cache: "no-store",
  })

  const data: Payment[] = await res.json()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">
        👋 สวัสดี {session.user?.name}
      </h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
