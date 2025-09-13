import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "./api/auth/[...nextauth]/route"
export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-black mb-4">
          FastFit Gym
        </h1>
        <p className="text-2xl text-gray-900 mb-8">
          ยินดีต้อนรับ
        </p>
      </div>
    </div>
  )
}