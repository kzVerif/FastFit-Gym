import NextAuth, { AuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import { compare } from "bcryptjs"

const prisma = new PrismaClient()

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(
        credentials: Record<"username" | "password", string>
      ): Promise<User | null> {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("กรุณากรอกข้อมูลให้ครบ")
        }

        // 🔎 หา user จาก DB
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        })

        if (!user) throw new Error("ไม่พบผู้ใช้งาน")

        // ✅ ตรวจสอบรหัสผ่าน
        const isValid = await compare(credentials.password, user.password)
        if (!isValid) throw new Error("รหัสผ่านไม่ถูกต้อง")

        // ✅ return ค่าในรูปแบบ User
        return {
          id: String(user.id), // ต้องเป็น string ตาม spec ของ next-auth
          name: user.name ?? user.username,
          email: null, // ไม่ใช้ก็ได้
        } as User
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
