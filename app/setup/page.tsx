import { SetupInstructions } from "@/components/SetupInstructions"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="container mx-auto py-8">
        <SetupInstructions />
      </div>
    </div>
  )
}
