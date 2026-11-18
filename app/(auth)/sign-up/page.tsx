
import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { SignUpPageClient } from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Sign Up | RentPro",
  description:
    "Create your RentPro account and start renting equipment in minutes.",
}

export default function SignUpPage() {
  return (
    <AuthShell
      heading={
        <>
          Join <span className="text-[#FF6B00]">RentPro</span> Today!
        </>
      }
      description="Get started with your account and enjoy seamless rental experience."
    >
      <SignUpPageClient />
    </AuthShell>
  )
}
