"use client";

import { useState } from "react";
import { toast } from "sonner"

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to create user");
      }

      const data = await res.json();
      console.log("Created:", data);
      toast.success("สมัครสมาชิกสำเร็จ");
      setFormData({ name: "", phone: "", startDate: "", endDate: "" });
    } catch (error) {
      console.error(error);
      toast.dismiss("สมัครสมาชิกไม่สำเร็จสำเร็จ")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-lg border border-border bg-card p-6 shadow-md"
      >
        <h1 className="text-2xl font-bold text-center">สมัครสมาชิกฟิตเนส</h1>

        {/* ชื่อ */}
        <div>
          <label className="block text-sm font-medium mb-1">ชื่อ</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="กรอกชื่อ"
          />
        </div>

        {/* เบอร์โทร */}
        <div>
          <label className="block text-sm font-medium mb-1">เบอร์โทร</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="08x-xxx-xxxx"
          />
        </div>

        {/* วันที่เริ่มต้น - วันที่สิ้นสุด */}
        <div>
          <label className="block text-sm font-medium mb-1">ช่วงเวลา</label>
          <div className="flex gap-2">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-1/2 rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-1/2 rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "กำลังบันทึก..." : "สมัครสมาชิก"}
        </button>
      </form>
    </div>
  );
}
