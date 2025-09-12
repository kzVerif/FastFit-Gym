import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-white mb-4">
          FastFit Gym
        </h1>
        <p className="text-2xl text-gray-200 mb-8">
          ยินดีต้อนรับ
        </p>
        <Button className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-xl font-semibold rounded-lg">
          เริ่มต้นเลย
        </Button>
      </div>
    </div>
  )
}