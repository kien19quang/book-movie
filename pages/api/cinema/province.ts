import { NextApiRequest, NextApiResponse } from "next";
import { CreateProvince, UpdateProvince } from "../../../types/cinema";
import prismadbClient from "../../../libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const province = await prismadbClient.province.findMany({ 
        include: {
          cinema: true
        }
      })

      return res.status(200).json(province)
    }
    else if (req.method === 'POST') {
      const data = req.body as CreateProvince
      const province = await prismadbClient.province.findUnique({ where: { id: Number(data.id) } })
      if (province) {
        return res.status(400).json({ error: 'Mã tỉnh thành đã tồn tại trong hệ thống' })
      }
      const response = await prismadbClient.province.create({
        data: {
          id: Number(data.id),
          name: data.name
        },
      })

      return res.status(200).json(response)
    }
    else if (req.method === 'PUT') {
      const data = req.body as UpdateProvince
      await prismadbClient.province.delete({
        where: {
          id: Number(data.oldId)
        }
      })
      const response = await prismadbClient.province.create({
        data: {
          id: Number(data.id),
          name: data.name
        },
      })

      return res.status(200).json(response)
    }
    else if (req.method === 'DELETE') {
      const { id } = req.query
      if (!id) {
        return res.status(400).json({ error: 'Mã tỉnh thành là bắt buộc' })
      }
      const province = await prismadbClient.province.delete({
        where: {
          id: Number(id)
        }
      })

      return res.status(200).json(province)
    }
    else {
      return res.status(405).end()
    }
  } catch(error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` })
  }
}