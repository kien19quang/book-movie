
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcrypt';
import prismadbClient from "../../../libs/prismadb";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {

    }
    else if (req.method === 'PUT') {
      const { email, name, id, role } = req.body

      const existingUser = await prismadbClient.user.findUnique({
        where: {
          id
        }
      })

      if (!existingUser) {
        return res.status(422).json({ error: 'Tài khoản này không tồn tại trong hệ thông' });
      }

      const updateRole = role ? { role } : { }

      const user = await prismadbClient.user.update({
        where: { id: id },
        data: {
          name: name,
          email: email,
          ...updateRole
        }
      })

      return res.status(200).json(user)
    }
    else if (req.method === 'DELETE') {
      const { id } = req.query

      const user = await prismadbClient.user.delete({
        where: {
          id: id as string
        }
      })

      return res.status(200).json(user)
    }
    else {
      return res.status(405).end()
    }
  } catch(error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` })
  }
}