import type { Metadata } from "next"

import { ContactContent } from "@/components/contact/ContactContent"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Contact Us | RentPro",
  description:
    "Contact RentPro for questions about equipment rentals, availability, bookings, and payments.",
}

export default function ContactPage() {
  return (
    <div className="flex min-h-svh flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <ContactContent />
      </main>
    </div>
  )
}
