
"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Check,
  Image as ImageIcon,
  Lock,
  Mail,
  User,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  AuthField,
  AuthInput,
  FormNotice,
  OrDivider,
  GoogleButton,
  PasswordVisibilityToggle,
} from "@/components/auth/form-controls"

export type SignUpValues = {
  name: string
  email: string
  photoUrl: string
  password: string
}

type SignUpFormProps = {
  mode: "signup"
  onSubmit: (data: SignUpValues) => Promise<void> | void
  error?: string | null
}

const initialValues: SignUpValues = {
  name: "",
  email: "",
  photoUrl: "",
  password: "",
}

export function SignUpForm({
  mode,
  onSubmit,
  error,
}: SignUpFormProps) {
  const [values, setValues] = useState<SignUpValues>(initialValues)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const passwordChecks = [
    { label: "At least 6 characters", met: values.password.length >= 6 },
    { label: "One uppercase letter", met: /[A-Z]/.test(values.password) },
    { label: "One lowercase letter", met: /[a-z]/.test(values.password) },
  ]

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    setValues((current) => ({ ...current, [name]: value }))
    setNotice(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (loading) return

    const payload: SignUpValues = {
      name: values.name.trim(),
      email: values.email.trim(),
      photoUrl: values.photoUrl.trim(),
      password: values.password,
    }

    try {
      setLoading(true)
      setNotice(null)

      await onSubmit(payload)
    } catch (err) {
      setNotice(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  function handleGoogleRegister() {
    setNotice("Google sign up will be connected once authentication is set up.")
  }

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="font-display text-[27px] leading-tight font-bold tracking-[-0.01em] text-[#071D49] sm:text-[30px]">
          Create Your Account
        </h1>
        <p className="mt-2 text-[14px] text-[#7B8AA3]">
          Fill in the details to get started
        </p>
      </header>

      <form onSubmit={handleSubmit} noValidate className="space-y-4.5">
        <AuthField id="sign-up-name" label="Full Name">
          <AuthInput
            id="sign-up-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            required
            icon={<User className="size-[18px]" aria-hidden="true" />}
            value={values.name}
            onChange={handleChange}
          />
        </AuthField>

        <AuthField id="sign-up-email" label="Email Address">
          <AuthInput
            id="sign-up-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            required
            icon={<Mail className="size-[18px]" aria-hidden="true" />}
            value={values.email}
            onChange={handleChange}
          />
        </AuthField>

        <AuthField
          id="sign-up-photo"
          label="Photo URL"
          hint="Optional profile picture link"
          describedBy="sign-up-photo-hint"
        >
          <AuthInput
            id="sign-up-photo"
            name="photoUrl"
            type="url"
            inputMode="url"
            placeholder="Use a direct image link or upload via imgbb"
            aria-describedby="sign-up-photo-hint"
            icon={<ImageIcon className="size-[18px]" aria-hidden="true" />}
            value={values.photoUrl}
            onChange={handleChange}
          />
        </AuthField>

        <AuthField id="sign-up-password" label="Password">
          <div className="space-y-2.5">
            <AuthInput
              id="sign-up-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              required
              aria-describedby="sign-up-password-rules"
              icon={<Lock className="size-[18px]" aria-hidden="true" />}
              value={values.password}
              onChange={handleChange}
              trailing={
                <PasswordVisibilityToggle
                  visible={showPassword}
                  onToggle={() => setShowPassword((visible) => !visible)}
                />
              }
            />

            <ul
              id="sign-up-password-rules"
              aria-live="polite"
              className="space-y-1.5 rounded-xl bg-[#FFF7ED] px-3.5 py-3"
            >
              {passwordChecks.map((check) => (
                <li
                  key={check.label}
                  className="flex items-center gap-2 text-[13px] leading-5"
                >
                  {check.met ? (
                    <Check
                      className="size-3.5 shrink-0 text-[#16A34A]"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                  ) : (
                    <X
                      className="size-3.5 shrink-0 text-[#DC2626]"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={cn(
                      check.met ? "text-[#15803D]" : "text-[#B91C1C]"
                    )}
                  >
                    {check.label}
                  </span>
                  <span className="sr-only">
                    {check.met ? "(met)" : "(not met yet)"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </AuthField>

        {notice ? <FormNotice>{notice}</FormNotice> : null}

        {error ? <FormNotice>{error}</FormNotice> : null}

        <Button
          type="submit"
          disabled={loading}
          className="group h-[52px] w-full gap-2 rounded-full bg-[#FF6B00] text-[15px] font-semibold text-white shadow-[0_18px_34px_-18px_rgba(255,107,0,0.95)] hover:bg-[#E85F00] focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2"
        >
          {loading ? "Creating account..." : "Register"}
          {!loading && (
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          )}
        </Button>

        <OrDivider />

        <GoogleButton
          label="Register with Google"
          onClick={handleGoogleRegister}
        />
      </form>

      <p className="border-t border-[#EDF1F7] pt-5 text-center text-[13.5px] text-[#5B6B84]">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-[#FF6B00] underline-offset-4 transition-colors outline-none hover:text-[#E85F00] hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[#FF6B00]/40"
        >
          Login
        </Link>
      </p>
    </div>
  )
}

export function SignUpPageClient() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async (data: SignUpValues) => {
    setError(null)

    try {
      const { error: signUpError } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        image: data.photoUrl || undefined,
        callbackURL: "/",
      })

      if (signUpError) {
        setError(
          signUpError.message ||
            "Unable to create your account. Please try again."
        )
        return
      }

      router.replace("/")
      router.refresh()
    } catch (err) {
      console.error("Signup error:", err)

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      )
    }
  }

  return (
    <SignUpForm
      mode="signup"
      onSubmit={handleSignUp}
      error={error}
    />
  )
}
