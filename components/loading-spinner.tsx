import { Scissors } from "lucide-react"

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 barza-gradient rounded-2xl flex items-center justify-center mx-auto animate-pulse">
          <Scissors className="w-8 h-8 text-white" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Loading Barza</h2>
          <p className="text-gray-600">Please wait while we prepare your dashboard...</p>
        </div>
      </div>
    </div>
  )
}
