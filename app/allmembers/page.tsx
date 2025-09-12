import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"
export default async function DemoPage() {
  const res = await fetch("http:/127.0.0.1:3000/api/subscriptions", {
    cache: "no-store",
  })
  const data: Payment[] = await res.json()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}