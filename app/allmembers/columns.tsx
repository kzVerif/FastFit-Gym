"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export type Payment = {
  id: string;
  name: string;
  status: "Active" | "inactive";
  tell: string;
  startDate: string;
  endDate: string;
};
import { toast } from "sonner";

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "name",
    header: "ชื่อ",
  },
  {
    accessorKey: "tell",
    header: "เบอร์โทร",
  },
  {
    accessorKey: "startDate",
    header: "วันที่เริ่มต้น",
    cell: ({ row }) => {
      const date = new Date(row.getValue("startDate"));
      return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    },
    sortingFn: "datetime", // ✅ เพิ่มฟังก์ชัน sort
  },
  {
    accessorKey: "endDate",
    header: "วันที่หมดอายุ",
    cell: ({ row }) => {
      const date = new Date(row.getValue("endDate"));
      return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    },
    sortingFn: "datetime", // ✅ เพิ่มฟังก์ชัน sort
  },

  {
    accessorKey: "status",
    header: "สถานะ",
    cell: ({ row }) => {
      const status = row.getValue<Payment["status"]>("status");
      return (
        <Badge
          className={
            status === "Active"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 hover:bg-gray-500"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const payment = row.original;
      const [open, setOpen] = useState(false);

      // state ฟอร์มแก้ไข
      const [name, setName] = useState(payment.name);
      const [tell, setTell] = useState(payment.tell);
      const [startDate, setStartDate] = useState(
        payment.startDate.split("T")[0] // แปลงให้เหลือ YYYY-MM-DD
      );
      const [endDate, setEndDate] = useState(payment.endDate.split("T")[0]);

      const [deleting, setDeleting] = useState(false);
      async function handleDelete() {
        if (!confirm(`ลบสมาชิก ${payment.name}?`)) return;
        try {
          setDeleting(true);
          await fetch(`/api/subscriptions/${payment.id}`, { method: "DELETE" });
          toast.success(`ลบสมาชิก ${payment.name} สำเร็จ`);
          setTimeout(() => location.reload(), 1000);
        } catch (err) {
          toast.error("ลบไม่สำเร็จ");
        } finally {
          setDeleting(false);
        }
      }
      const [loading, setLoading] = useState(false);
      async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        try {
          setLoading(true); // ✅ เริ่มโหลด
          await fetch(`/api/subscriptions/${payment.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, tell, startDate, endDate }),
          });
          toast.success(`อัปเดตข้อมูลของ ${name} แล้ว`);
          setOpen(false);

          setTimeout(() => location.reload(), 1000);
        } catch (err) {
          toast.error("แก้ไขไม่สำเร็จ");
        } finally {
          setLoading(false); // ✅ หยุดโหลด
        }
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>การจัดการ</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setOpen(true)}>
                แก้ไข
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                {deleting ? "กำลังลบ..." : "ลบ"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Modal ฟอร์มแก้ไข */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>แก้ไขข้อมูลสมาชิก</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label>ชื่อ</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>เบอร์โทร</Label>
                  <Input
                    value={tell}
                    onChange={(e) => setTell(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>วันที่เริ่มต้น</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>วันที่หมดอายุ</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        กำลังบันทึก...
                      </>
                    ) : (
                      "บันทึก"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
