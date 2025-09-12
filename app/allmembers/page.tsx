import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"
export default async function DemoPage() {
  const res = await fetch("https://fast-fit-gym.vercel.app/api/subscriptions", {
    cache: "no-store",
  })
  const data: Payment[] = await res.json()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}