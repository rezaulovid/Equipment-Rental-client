import { betterAuth } from "better-auth"
import { jwt } from "better-auth/plugins"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

import { DEFAULT_USER_ROLE, isUserRole, USER_ROLES } from "@/lib/user-role"

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string)
const db = client.db("rentalAdmindb")

export { client, db }

export const auth = betterAuth({
  //...

  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: ["customer", "owner", "admin"],
        required: false,
        input: true,
        defaultValue: DEFAULT_USER_ROLE,
        validator: {
          input: {
            "~standard": {
              version: 1,
              vendor: "rentpro",
              validate(value: unknown) {
                if (isUserRole(value)) {
                  return { value }
                }

                return {
                  issues: [
                    {
                      message: `Role must be one of: ${USER_ROLES.join(", ")}.`,
                    },
                  ],
                }
              },
            },
          },
        },
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
