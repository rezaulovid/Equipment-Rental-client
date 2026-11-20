import { betterAuth } from "better-auth"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { jwt } from "better-auth/plugins"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

import { DEFAULT_USER_ROLE } from "@/lib/user-role"

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string)
const db = client.db("rentalAdmindb")

export { client, db }

export const auth = betterAuth({
  //...

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  hooks: {
    before: createAuthMiddleware(async (context) => {
      if (context.path !== "/sign-up/email") return

      const password = context.body?.password
      if (
        typeof password !== "string" ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password)
      ) {
        throw new APIError("BAD_REQUEST", {
          message:
            "Password must include at least one uppercase and one lowercase letter.",
        })
      }
    }),
  },
  user: {
    additionalFields: {
      role: {
        type: ["customer", "owner", "admin"],
        required: false,
        input: false,
        defaultValue: DEFAULT_USER_ROLE,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
        defaultValue: "",
      },
      address: {
        type: "string",
        required: false,
        input: true,
        defaultValue: "",
      },
    },
  },
  /**
   * Issues the access token the Express API verifies with `jose`. The client
   * fetches it from `/api/auth/token` and sends it as a Bearer token.
   */
  plugins: [jwt()],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
})
