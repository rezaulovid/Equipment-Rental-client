import * as React from "react"
import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { SignInPageClient } from "@/components/auth/sign-in-page-client"

export const metadata: Metadata = {
  title: "Sign In | RentPro",
  description:
    "Sign in to your RentPro account to manage equipment rentals and bookings.",
}

export default function SignInPage() {
  return (
    <AuthShell
      heading={
        <>
          Rent Smart,
          <br />
          <span className="text-[#FF6B00]">Work Better</span>
        </>
      }
      description="Your trusted rental platform for all equipment needs."
    >
      <React.Suspense fallback={null}>
        <SignInPageClient />
      </React.Suspense>
    </AuthShell>
  )
}
