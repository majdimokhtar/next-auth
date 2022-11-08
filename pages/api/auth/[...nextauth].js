import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { verifyPassword } from "../../../lib/auth"
import { connectDb } from "../../../lib/db"

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const client = await connectDb()
        const userCollection = client.db().collection("users")
        const user = await userCollection.findOne({ email: credentials.email })

        if (!user) {
          client.close()
          throw new Error("no user found!!")
        }
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        )
        if (!isValid) {
          client.close()
          throw new Error("could not log you in")
        }
        client.close()
        return { email: user.email }
      },
    }),
  ],
})
