import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "Use /api/bookings to create an equipment rental checkout.",
    },
    { status: 400 },
  )
}
