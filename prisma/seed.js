// prisma/seed.js
const { PrismaClient } = require("@prisma/client")
const { hash } = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  const password = await hash("fastfit99999999", 10)

  await prisma.user.upsert({
    where: { username: "fastfit" },
    update: {},
    create: {
      username: "fastfit",
      password,
      name: "Admin Fast Fit",
    },
  })

  console.log("✅ User seeded")
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
