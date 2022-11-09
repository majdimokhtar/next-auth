import { getSession } from "next-auth/client"
import { hashPassword, verifyPassword } from "../../../lib/auth"
import { connectDb } from "../../../lib/db"

async function handler(req, res) {
  if (req.method !== "PATCH") {
    return
  }
  const session = await getSession({
    req: req,
  })
  if (!session) {
    res.status(401).json({ message: "Not authenticated" })
    client.close()
    return
  }
  const userEmail = session.user.email
  const oldPassword = req.body.oldPassword
  const newPassword = req.body.newPassword
  const client = await connectDb()
  const userCollection = client.db().collection("users")
  const user = await userCollection.findOne({ email: userEmail })
  if (!user) {
    res.status(404).json({ message: "user not found" })
    client.close()
    return
  }
  const currentPassword = user.password
  const passwordsAreEquals = await verifyPassword(oldPassword, currentPassword)
  if (!passwordsAreEquals) {
    res.status(422).json({ message: "Invalid password" })
    client.close()
    return
  }
  const hashedPassword = await hashPassword(newPassword)
  const result = await userCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  )
  client.close()
  res.status(200).json({ message: "password updated!" })
}

export default handler
