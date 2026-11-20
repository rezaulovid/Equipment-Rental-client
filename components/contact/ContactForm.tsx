"use client"

import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react"
import { Info, Loader2, Send } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { CONTACT_DEMO_NOTE } from "@/lib/contact-info"
import {
  CONTACT_MESSAGE_MAX_LENGTH,
  validateContactForm,
  type ContactFormValues,
  type FieldErrors,
} from "@/lib/validation"

const INITIAL_VALUES: ContactFormValues = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
}

const CONTACT_TOAST_ID = "contact-form"

type ContactResponse = {
  success: boolean
  message?: string
  errors?: FieldErrors
  data?: {
    referenceId?: string
    demoMode?: boolean
    delivered?: boolean
  }
}

const inputClass =
  "h-12 w-full rounded-xl border border-[#E3E9F2] bg-[#FBFCFE] px-4 text-[15px] font-medium text-[#071D49] shadow-[inset_0_1px_2px_rgba(7,29,73,0.03)] transition-colors outline-none placeholder:font-normal placeholder:text-[#93A1B8] hover:border-[#CBD8E8] focus:border-[#FF6B00] focus:bg-white focus:ring-4 focus:ring-[#FF6B00]/15 aria-invalid:border-[#DC2626] aria-invalid:ring-4 aria-invalid:ring-[#DC2626]/15 disabled:cursor-not-allowed disabled:opacity-70"

function Field({
  id,
  label,
  error,
  optional,
  hint,
  children,
}: {
  id: string
  label: string
  error?: string
  optional?: boolean
  hint?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#071D49]"
      >
        {label}
        {optional ? (
          <span className="text-xs font-normal text-[#7B8AA3]">(optional)</span>
        ) : (
          <span aria-hidden="true" className="text-[#FF6B00]">
            *
          </span>
        )}
      </label>

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs font-medium text-[#DC2626]"
        >
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs leading-5 text-[#7B8AA3]">{hint}</p>
      ) : null}
    </div>
  )
}

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target

    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      if (!current[name]) return current

      const next = { ...current }
      delete next[name]
      return next
    })
  }

  function focusFirstError(nextErrors: FieldErrors) {
    const firstKey = Object.keys(nextErrors)[0]
    if (!firstKey) return

    document.getElementById(firstKey)?.focus()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (submitting) return

    const nextErrors = validateContactForm(values)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      focusFirstError(nextErrors)
      toast.error("Please check the highlighted fields.", {
        id: CONTACT_TOAST_ID,
        duration: 7000,
      })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const payload = (await response
        .json()
        .catch(() => null)) as ContactResponse | null

      if (!response.ok || !payload?.success) {
        const serverErrors = payload?.errors ?? {}

        if (Object.keys(serverErrors).length > 0) {
          setErrors(serverErrors)
          focusFirstError(serverErrors)
        }

        toast.error(
          Object.keys(serverErrors).length > 0
            ? "Please check the highlighted fields."
            : (payload?.message ??
                "We couldn't submit your message. Please try again."),
          { id: CONTACT_TOAST_ID, duration: 7000 }
        )
        return
      }

      const referenceId = payload.data?.referenceId

      toast.success("Your message was received in demo mode.", {
        id: CONTACT_TOAST_ID,
        description: referenceId
          ? `Reference ${referenceId}. No email was sent because email delivery is not connected yet.`
          : "No email was sent because email delivery is not connected yet.",
        duration: 10000,
      })

      setValues(INITIAL_VALUES)
      setErrors({})
    } catch {
      toast.error(
        "We couldn't reach the server. Please check your connection and try again.",
        { id: CONTACT_TOAST_ID, duration: 7000 }
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="fullName" label="Full Name" error={errors.fullName}>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            maxLength={80}
            value={values.fullName}
            onChange={handleChange}
            disabled={submitting}
            aria-required="true"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            placeholder="e.g. Ayesha Rahman"
            className={inputClass}
          />
        </Field>

        <Field id="email" label="Email Address" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            value={values.email}
            onChange={handleChange}
            disabled={submitting}
            aria-required="true"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            placeholder="you@example.com"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="phone"
          label="Phone Number"
          error={errors.phone}
          optional
        >
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            value={values.phone}
            onChange={handleChange}
            disabled={submitting}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            placeholder="+880 1XXX-XXXXXX"
            className={inputClass}
          />
        </Field>

        <Field id="subject" label="Subject" error={errors.subject}>
          <input
            id="subject"
            name="subject"
            type="text"
            maxLength={120}
            value={values.subject}
            onChange={handleChange}
            disabled={submitting}
            aria-required="true"
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "subject-error" : undefined}
            placeholder="How can we help?"
            className={inputClass}
          />
        </Field>
      </div>

      <Field
        id="message"
        label="Message"
        error={errors.message}
        hint={`${values.message.length} / ${CONTACT_MESSAGE_MAX_LENGTH} characters`}
      >
        <textarea
          id="message"
          name="message"
          rows={5}
          maxLength={CONTACT_MESSAGE_MAX_LENGTH}
          value={values.message}
          onChange={handleChange}
          disabled={submitting}
          aria-required="true"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder="Tell us about the equipment you need, your dates, or any questions you have."
          className={cn(inputClass, "min-h-[150px] resize-y py-3")}
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-6 text-sm font-semibold text-white shadow-[0_14px_30px_-14px_rgba(255,107,0,0.85)] transition-colors duration-200 outline-none hover:bg-[#E85F00] focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-[#FF6B00]"
      >
        {submitting ? (
          <>
            <Loader2
              aria-hidden="true"
              className="size-4 animate-spin"
              strokeWidth={2.4}
            />
            Sending...
          </>
        ) : (
          <>
            <Send aria-hidden="true" className="size-4" strokeWidth={2.4} />
            Send Message
          </>
        )}
      </button>

      <span role="status" aria-live="polite" className="sr-only">
        {submitting ? "Sending your message." : ""}
      </span>

      <p className="flex items-start gap-2.5 rounded-xl border border-[#FFE2C7] bg-[#FFF7ED] px-3.5 py-3 text-xs leading-5 text-[#9A5B21]">
        <Info
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0"
          strokeWidth={2.2}
        />
        <span>
          <strong className="font-semibold">Demo mode:</strong>{" "}
          {CONTACT_DEMO_NOTE}
        </span>
      </p>
    </form>
  )
}
