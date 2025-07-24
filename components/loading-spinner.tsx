"use client"

import { Scissors } from "lucide-react"

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 barza-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Scissors className="w-8 h-8 text-white animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Barza</h2>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
