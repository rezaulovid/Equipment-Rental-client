/**
 * Central place for the public RentPro support details.
 *
 * These are placeholder/demo values — update them here once and both the
 * Contact page cards and the contact hero will stay in sync.
 */
export const CONTACT_INFO = {
  email: "support@rentalpro.demo",
  phone: "+880 1700-000000",
  phoneHref: "tel:+8801700000000",
  address: "House 12, Road 5, Sector 3, Uttara, Dhaka, Bangladesh",
  hours: "Saturday – Thursday, 9:00 AM – 6:00 PM",
  hoursDays: "Saturday – Thursday",
  hoursTime: "9:00 AM – 6:00 PM",
  mapHref:
    "https://www.google.com/maps/search/?api=1&query=House+12+Road+5+Sector+3+Uttara+Dhaka+Bangladesh",
} as const

/** Message shown in the form so nobody mistakes the demo for real delivery. */
export const CONTACT_DEMO_NOTE =
  "Submissions are validated and recorded on the server for this demo. No email is sent until an email provider is connected."
