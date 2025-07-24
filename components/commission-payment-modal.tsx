"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, DollarSign, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BookingRequest {
  id: string
  clientName: string
  service: string
  date: string
  time: string
  price: number
  status: "pending" | "accepted" | "completed"
  commission: number
}

interface CommissionPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  booking: BookingRequest | null
}

export function CommissionPaymentModal({ isOpen, onClose, booking }: CommissionPaymentModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, or PDF file",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: "Missing receipt",
        description: "Please upload a payment receipt",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    // Simulate file upload and payment submission
    setTimeout(() => {
      toast({
        title: "Payment proof submitted",
        description: "Your payment proof has been submitted for validation. You'll be notified once it's approved.",
      })
      setLoading(false)
      onClose()
      resetForm()
    }, 2000)
  }

  const resetForm = () => {
    setSelectedFile(null)
    setNotes("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!booking) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Commission Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Details */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{booking.clientName}</h4>
              <Badge variant="outline">{booking.service}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>{booking.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span>${booking.price}</span>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Commission Due (15%)</span>
                <span className="text-lg font-bold text-orange-600">${booking.commission}</span>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="receipt">Payment Receipt</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input id="receipt" type="file" accept="image/*,.pdf" onChange={handleFileSelect} className="hidden" />
              <label htmlFor="receipt" className="cursor-pointer">
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-orange-600">Click to upload</span> or drag and drop
                  </div>
                  <div className="text-xs text-gray-500">PNG, JPG or PDF (max. 5MB)</div>
                </div>
              </label>
            </div>

            {selectedFile && (
              <div className="flex items-center space-x-2 p-2 bg-green-50 rounded border border-green-200">
                <FileText className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">{selectedFile.name}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedFile(null)}
                  className="ml-auto text-green-600 hover:text-green-800"
                >
                  ×
                </Button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information about the payment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Payment Instructions */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Payment Instructions</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Upload a clear photo or PDF of your payment receipt</li>
              <li>• Ensure the amount and date are visible</li>
              <li>• Payment will be validated within 24-48 hours</li>
              <li>• You'll receive a confirmation once approved</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !selectedFile}
              className="flex-1 barza-gradient text-white"
            >
              {loading ? "Submitting..." : "Submit Payment Proof"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
