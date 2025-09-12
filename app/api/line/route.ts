import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    for (const event of body.events) {
      if (event.type === "message" && event.message.type === "text") {
        const tell = event.message.text.trim();

        // 🔎 ค้นหาจาก Database
        const member = await prisma.subscriptions.findFirst({
          where: { tell },
        });

        if (member) {
          const now = new Date();
          const expired = now > member.endDate;

          if (expired) {
            // 📝 อัพเดท Database → ให้สถานะเป็น expired
            await prisma.subscriptions.update({
              where: { id: member.id },
              data: { status: "expired" },
            });

            // ❌ ตอบกลับ LINE
            const msg = `👤 ชื่อ: ${member.name}
📞 เบอร์: ${member.tell}
📅 วันที่เริ่มต้น: ${member.startDate.toISOString().split("T")[0]}
⏳ วันหมดอายุ: ${member.endDate.toISOString().split("T")[0]}
❌ สถานะ: หมดอายุแล้ว (อัพเดทในระบบเรียบร้อย)`; 

            await fetch("https://api.line.me/v2/bot/message/reply", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
              },
              body: JSON.stringify({
                replyToken: event.replyToken,
                messages: [{ type: "text", text: msg }],
              }),
            });
          } else {
            // ✅ ถ้ายังไม่หมดอายุ
            const msg = `👤 ชื่อ: ${member.name}
📞 เบอร์: ${member.tell}
📅 วันที่เริ่มต้น: ${member.startDate.toISOString().split("T")[0]}
⏳ วันหมดอายุ: ${member.endDate.toISOString().split("T")[0]}
✅ สถานะ: ใช้งานได้`;

            await fetch("https://api.line.me/v2/bot/message/reply", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
              },
              body: JSON.stringify({
                replyToken: event.replyToken,
                messages: [{ type: "text", text: msg }],
              }),
            });
          }
        } else {
          // ❌ ถ้าไม่เจอเบอร์
          await fetch("https://api.line.me/v2/bot/message/reply", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({
              replyToken: event.replyToken,
              messages: [{ type: "text", text: `ไม่พบข้อมูลเบอร์ ${tell}` }],
            }),
          });
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
