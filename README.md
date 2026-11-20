# RentPro Equipment Rental Platform

RentPro is a responsive equipment rental marketplace built with Next.js. Customers
can browse approved listings, save favorites, book equipment, and pay through
Stripe. Owners manage listings and rental requests, while administrators manage
users, approvals, rentals, and platform analytics.

## Features

- Better Auth email/password and Google sign-in
- Customer, owner, and admin dashboards
- Six newest approved equipment listings loaded from the rental API
- Server-side equipment search, filtering, and sorting
- Persistent favorites, availability checks, and booking checkout
- Stripe payment confirmation and payment history
- Verified customer reviews for paid, completed rentals
- Owner and admin analytics
- Framer Motion animations with reduced-motion support

## Requirements

- Node.js 20+
- A running rental API
- MongoDB for Better Auth
- Google OAuth credentials when Google sign-in is enabled
- ImageBB and Stripe credentials for the related services

## Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in the values without committing secrets.
3. Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The application runs at `http://localhost:3000` by default.

## Useful commands

```bash
npm run lint
npm run typecheck
npm run build
```

## Main packages

Next.js, React, Better Auth, MongoDB, Stripe-compatible API integration,
Tailwind CSS, Base UI, Lucide React, Framer Motion, and TypeScript.
