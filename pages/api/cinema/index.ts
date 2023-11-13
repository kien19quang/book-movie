import { NextApiRequest, NextApiResponse } from "next";
import { CreateCinema, UpdateCinema } from "../../../types/cinema";
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

      if (!data.provinceId) {
        return res.status(400).json({ error: 'Mã tỉnh thành là bắt buộc' })
      }

      const province = await prismadbClient.province.findUnique({
        where: {
          id: data.provinceId
        }
      })

      if (!province) {
        return res.status(400).json({ error: 'Tỉnh thành này không tồn tại' })
      }

      const cinema = await prismadbClient.cinema.create({
        data: {
          name: data.name,
          provinceId: data.provinceId,
        },
        include: {
          province: true
        }
      })

      return res.status(200).json(cinema)
    }
    else if (req.method === 'PUT') {
      const data = req.body as UpdateCinema

      if (!data.provinceId) {
        return res.status(400).json({ error: 'Mã tỉnh thành là bắt buộc' })
      }

      const province = await prismadbClient.province.findUnique({
        where: {
          id: data.provinceId
        }
      })

      if (!province) {
        return res.status(400).json({ error: 'Tỉnh thành này không tồn tại' })
      }

      const cinema = await prismadbClient.cinema.update({
        where: {
          id: data.id
        },
        data: {
          name: data.name,
          provinceId: data.provinceId,
        },
        include: {
          province: true
        }
      })

      return res.status(200).json(cinema)
    }
    else if (req.method === 'DELETE') {
      const { id } = req.query

      const cinema = await prismadbClient.cinema.findUnique({
        where: {
          id: id as string
        }
      })

      if (!cinema) {
        return res.status(400).json({ error: 'Rạp chiếu phim này không tồn tại' })
      }

      const response = await prismadbClient.cinema.delete({
        where: {
          id: cinema.id
        }
      })

      return res.status(200).json(response)
    }
    else {
      return res.status(405).end()
    }
  } catch(error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` })
  }
}