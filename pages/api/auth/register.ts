import prismadbClient from "@/libs/prismadb";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcrypt';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end()
    }
    const { email, name, password } = req.body

    const existingUser = await prismadbClient.user.findUnique({
      where: {
        email
      }
    })

    if (existingUser) {
      return res.status(422).json({ error: 'Tài khoản đã tồn tại trong hệ thông' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prismadb.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: '',
        emailVerified: new Date(),
      }
    })

    return res.status(200).json(user);
  } catch(error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` })
  }
}