import { hashPassword } from "../../../lib/auth"
import { connectDb } from "../../../lib/db"

async function handler(req, res) {
  if (req.method !== "POST") {
    return
  }
  const data = req.body
  const { email, password } = data
  if (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({
      message: "Invalid Input - password must be at least 7 charachters long",
    })
    return
  }
  const client = await connectDb()
  const db = client.db()
  const existsUser = await db.collection("users").findOne({ email: email })
  if (existsUser) {
    res.status(422).json({ message: "user already exist" })
    client.close()
    return
  }
  const heshedPassword = await hashPassword(password)
  const result = await db.collection("users").insertOne({
    email: email,
    password: heshedPassword,
  })

  res.status(200).json({ message: "created user!!!" })
  client.close()
}

export default handler
