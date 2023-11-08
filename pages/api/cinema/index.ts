import { NextApiRequest, NextApiResponse } from "next";
import { CreateCinema } from "../../../types/cinema";
import prismadbClient from "../../../libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { provinceId } = req.query

      if (!provinceId) {
        return res.status(400).json({ error: 'Mã tỉnh thành là bắt buộc' })
      }

      const listCinema = await prismadbClient.cinema.findMany({
        where: { provinceId: Number(provinceId) }
      })

      return res.status(200).json(listCinema)
    }
    else if (req.method === 'POST') {
      const data = req.body as CreateCinema

      const cinema = await prismadbClient.cinema.create({
        data: {
          name: data.name,
          provinceId: data.provinceId,
        }
      })

      return res.status(200).json(cinema)
    }
    else {
      return res.status(405).end()
    }
  } catch(error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` })
  }
}