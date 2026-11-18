"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { SignInForm, type SignInFormData } from "@/components/auth/sign-in-form"
import { authClient } from "@/lib/auth-client"

export function SignInPageClient() {
  const [error, setError] = React.useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  // Redirect users to their original page after successful sign in.
  const redirectTo = searchParams.get("redirectTo") || "/"

  const handleSignIn = async (data: SignInFormData) => {
    setError(null)

    try {
      const { error: signInError } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
        callbackURL: redirectTo,
      })

      if (signInError) {
        setError(
          signInError.message || "Invalid email or password. Please try again."
        )
        return
      }

      // Refresh the session and navigate to the destination.
      router.replace(redirectTo)
      router.refresh()
    } catch (err) {
      console.error("Signin error:", err)

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      )
    }
  }

  return <SignInForm mode="signin" onSubmit={handleSignIn} error={error} />
}
