
"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Lock, Mail } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  AuthField,
  AuthInput,
  FormNotice,
  GoogleButton,
  GoogleIcon,
  OrDivider,
  PasswordVisibilityToggle,
} from "@/components/auth/form-controls"
import { authClient } from "@/lib/auth-client"

export type SignInFormData = {
  email: string
  password: string
  rememberMe: boolean
}

type SignInFormProps = {
  mode: "signin"
  onSubmit: (data: SignInFormData) => Promise<void> | void
  error?: string | null
}

type SignInMethod = "email" | "google"

type SignInValues = SignInFormData

const initialValues: SignInValues = {
  email: "",
  password: "",
  rememberMe: false,
}

function SignInFormContent({
  mode,
  onSubmit,
  error,
}: SignInFormProps) {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/"

  const [method, setMethod] = useState<SignInMethod>("email")
  const [values, setValues] = useState<SignInValues>(initialValues)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [googleError, setGoogleError] = useState<string | null>(null)

  function updateValue<Key extends keyof SignInValues>(
    key: Key,
    value: SignInValues[Key]
  ) {
    setValues((current) => ({ ...current, [key]: value }))
    setNotice(null)
    setGoogleError(null)
  }

  function selectMethod(nextMethod: SignInMethod) {
    setMethod(nextMethod)
    setNotice(null)
    setGoogleError(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (loading || googleLoading) return

    setNotice(null)
    setGoogleError(null)
    setLoading(true)

    try {
      const data: SignInFormData = {
        email: values.email.trim(),
        password: values.password,
        rememberMe: values.rememberMe,
      }

      await onSubmit(data)
    } catch (err) {
      console.error("Sign in form error:", err)
      setNotice(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    if (loading || googleLoading) return

    setNotice(null)
    setGoogleError(null)

    try {
      setGoogleLoading(true)

      const { error: signInError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      })

      if (signInError) {
        setGoogleError(
          signInError.message ||
            "Google sign in failed. Please try again."
        )
        setGoogleLoading(false)
      }
    } catch (err) {
      console.error("Google signin error:", err)

      setGoogleError(
        err instanceof Error
          ? err.message
          : "Unable to sign in with Google. Please try again."
      )

      setGoogleLoading(false)
    }
  }

  function handleForgotPassword() {
    setNotice(
      "Password reset will be available once authentication is set up."
    )
  }

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="font-display text-[27px] leading-tight font-bold tracking-[-0.01em] text-[#071D49] sm:text-[30px]">
          Welcome Back!
        </h1>
        <p className="mt-2 text-[14px] text-[#7B8AA3]">
          Sign in to your account
        </p>
      </header>

      <div
        role="group"
        aria-label="Sign in method"
        className="grid grid-cols-2 gap-1 rounded-xl bg-[#F1F5F9] p-1"
      >
        <button
          type="button"
          aria-pressed={method === "email"}
          onClick={() => selectMethod("email")}
          className={cn(
            "inline-flex h-10 items-center justify-center gap-2 rounded-[10px] text-[13.5px] font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]/40",
            method === "email"
              ? "bg-[#071D49] text-white shadow-sm"
              : "text-[#41536E] hover:bg-white"
          )}
        >
          <Mail className="size-4" aria-hidden="true" />
          Email Login
        </button>

        <button
          type="button"
          aria-pressed={method === "google"}
          onClick={() => selectMethod("google")}
          className={cn(
            "inline-flex h-10 items-center justify-center gap-2 rounded-[10px] text-[13.5px] font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]/40",
            method === "google"
              ? "bg-[#071D49] text-white shadow-sm"
              : "text-[#41536E] hover:bg-white"
          )}
        >
          <GoogleIcon className="size-4" />
          Google Login
        </button>
      </div>

      {method === "email" ? (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <AuthField id="sign-in-email" label="Email Address">
            <AuthInput
              id="sign-in-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              required
              icon={<Mail className="size-[18px]" aria-hidden="true" />}
              value={values.email}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                updateValue("email", event.target.value)
              }
            />
          </AuthField>

          <AuthField id="sign-in-password" label="Password">
            <AuthInput
              id="sign-in-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
              icon={<Lock className="size-[18px]" aria-hidden="true" />}
              value={values.password}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                updateValue("password", event.target.value)
              }
              trailing={
                <PasswordVisibilityToggle
                  visible={showPassword}
                  onToggle={() =>
                    setShowPassword((visible) => !visible)
                  }
                />
              }
            />
          </AuthField>

          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="sign-in-remember"
              className="flex cursor-pointer items-center gap-2 text-[13.5px] font-medium text-[#41536E]"
            >
              <input
                id="sign-in-remember"
                name="rememberMe"
                type="checkbox"
                checked={values.rememberMe}
                onChange={(event) =>
                  updateValue("rememberMe", event.target.checked)
                }
                className="size-4 cursor-pointer rounded border-[#CBD5E1] accent-[#FF6B00]"
              />
              Remember Me
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="rounded text-[13.5px] font-semibold text-[#FF6B00] transition-colors outline-none hover:text-[#E85F00] hover:underline focus-visible:ring-2 focus-visible:ring-[#FF6B00]/40"
            >
              Forgot Password?
            </button>
          </div>

          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-[13px] leading-6 text-red-700"
            >
              {error}
            </p>
          ) : null}

          {notice ? <FormNotice>{notice}</FormNotice> : null}

          <Button
            type="submit"
            disabled={loading || googleLoading}
            className="group h-[52px] w-full gap-2 rounded-full bg-[#FF6B00] text-[15px] font-semibold text-white shadow-[0_18px_34px_-18px_rgba(255,107,0,0.95)] hover:bg-[#E85F00] focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
            {!loading && (
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            )}
          </Button>

          <OrDivider />

          <GoogleButton
            label={
              googleLoading
                ? "Redirecting..."
                : "Continue with Google"
            }
            onClick={handleGoogleLogin}
          />
        </form>
      ) : (
        <div className="space-y-4">
          <p className="rounded-xl border border-[#E3E9F2] bg-[#F8FAFD] px-4 py-3.5 text-[13px] leading-6 text-[#41536E]">
            You will be redirected to Google to finish signing in.
          </p>

          {googleError ? (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-[13px] leading-6 text-red-700"
            >
              {googleError}
            </p>
          ) : null}

          {notice ? <FormNotice>{notice}</FormNotice> : null}

          <GoogleButton
            label={
              googleLoading
                ? "Redirecting..."
                : "Continue with Google"
            }
            onClick={handleGoogleLogin}
          />
        </div>
      )}

      <p className="border-t border-[#EDF1F7] pt-5 text-center text-[13.5px] text-[#5B6B84]">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-[#FF6B00] underline-offset-4 transition-colors outline-none hover:text-[#E85F00] hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[#FF6B00]/40"
        >
          Register
        </Link>
      </p>
    </div>
  )
}

export function SignInForm(props: SignInFormProps) {
  return (
    <Suspense fallback={null}>
      <SignInFormContent {...props} />
    </Suspense>
  )
}
