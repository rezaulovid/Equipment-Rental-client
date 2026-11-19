"use client"

import { useState } from "react"

import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  destructive = false,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  destructive?: boolean
  onConfirm: () => Promise<void> | void
}) {
  const [working, setWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    if (working) return

    try {
      setWorking(true)
      setError(null)
      await onConfirm()
      onOpenChange(false)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "The action could not be completed."
      )
    } finally {
      setWorking(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!working) {
          setError(null)
          onOpenChange(next)
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {error ? <Alert variant="error">{error}</Alert> : null}

        <DialogFooter>
          <Button
            variant="outline"
            disabled={working}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={working}
            onClick={handleConfirm}
            className={
              destructive
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-brand-orange text-white hover:bg-brand-orange-strong"
            }
          >
            {working ? "Working..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
