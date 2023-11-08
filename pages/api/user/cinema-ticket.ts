import { NextApiRequest, NextApiResponse } from "next";
import { CreateCinemaTicketDto, StatusCinemaTicket } from "../../../types/user";
import prismadbClient from "../../../libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const data = req.body as CreateCinemaTicketDto
      if (!data.movieId || !data.userId) {
        return res.status(400).json({ error: 'Movie Id và User Id là bắt buộc' });
      }
      const user = await prismadbClient.user.findUnique({ where: { id: data.userId } })
      if (!user) {
        return res.status(400).json({ error: 'User này không tồn tại trong hệ thống' });
      }
      const listCinemaTicket = user.cinemaTicket || []
      const idxCinemaTicket = listCinemaTicket.findIndex(item => item.id === data.movieId && item.status === data.status)
      if (idxCinemaTicket > -1) {
        listCinemaTicket[idxCinemaTicket].quantity += data.quantity;
      }
      else {
        listCinemaTicket.push({
          id: data.movieId,
          title: data.title,
          overview: data.overview,
          thumbnailUrl: data.thumbnailUrl,
          status: data.status,
          voteCount: data.voteCount,
          voteAverage: data.voteAverage,
          ticketPrice: data.ticketPrice,
          quantity: data.quantity,
          createdAt: new Date(),
          updatedAt: new Date(),
          provinceId: data?.provinceId ? Number(data.provinceId) : null,
          cinemaId: data.cinemaId as any,
          dayBookTicket: data.dayBookTicket as any,
          type: data.type as any,
          movieScreenTime: data.movieScreenTime as any
        })
      }

      const response = await prismadbClient.user.update({
        where: { id: user.id },
        data: {
          cinemaTicket: listCinemaTicket,
        }
      })

      return res.status(200).json(response.cinemaTicket)
    }
    else if (req.method === 'PUT') {
      const data = req.body as CreateCinemaTicketDto
      const { type } = req.query
      if (!data.movieId || !data.userId) {
        return res.status(400).json({ error: 'Movie Id và User Id là bắt buộc' });
      }
      const user = await prismadbClient.user.findUnique({ where: { id: data.userId } })
      if (!user) {
        return res.status(400).json({ error: 'User này không tồn tại trong hệ thống' });
      }
      const status = type === 'book' ? StatusCinemaTicket['pending'] : StatusCinemaTicket['canceled']
      const listCinemaTicket = user.cinemaTicket || []
      const idxCinemaTicket = listCinemaTicket.findIndex(item => item.id === data.movieId && item.status === status)
      if (idxCinemaTicket > -1) {
        listCinemaTicket[idxCinemaTicket] = {
          id: data.movieId,
          title: data.title,
          overview: data.overview,
          thumbnailUrl: data.thumbnailUrl,
          status: data.status,
          voteCount: data.voteCount,
          voteAverage: data.voteAverage,
          ticketPrice: data.ticketPrice,
          quantity: data.quantity,
          createdAt: new Date(),
          updatedAt: new Date(),
          provinceId: data?.provinceId ? Number(data.provinceId) : null,
          cinemaId: data.cinemaId as any,
          dayBookTicket: data.dayBookTicket as any,
          type: data.type as any,
          movieScreenTime: data.movieScreenTime as any
        };
      }

      const response = await prismadbClient.user.update({
        where: { id: user.id },
        data: {
          cinemaTicket: listCinemaTicket,
        }
      })
      console.log(response.cinemaTicket)

      return res.status(200).json(response.cinemaTicket)
    }
    else if (req.method === 'GET') {
      const { userId, status } = req.query
      if (!userId) {
        return res.status(400).json({ error: 'User Id là bắt buộc' })
      }
      const user = await prismadbClient.user.findUnique({ where: { 
        id: userId as string,
      }})
      if (!user) {
        return res.status(400).json({ error: 'User này không tồn tại trên hệ thống' })
      }
      if (status && status !== 'all') {
        user.cinemaTicket = user.cinemaTicket.filter(item => item.status === status);
      }

      return res.status(200).json(user.cinemaTicket)
    }
    else if (req.method === 'DELETE') {
      const { userId, movieId, type } = req.query

      if (!userId || !movieId) {
        return res.status(400).json({ error: 'User Id và Movie Id là bắt buộc' })
      }

      const user = await prismadbClient.user.findUnique({ where: { id: userId as string } })
      if (!user) {
        return res.status(400).json({ error: 'User này không tồn tại trong hệ thống' });
      }
      let cinemaTicket: any = []
      if (type === 'delete') {
        cinemaTicket = user.cinemaTicket.filter(item => item.id !== Number(movieId))
      }
      else {
        const index = user.cinemaTicket.findIndex(item => item.id === Number(movieId) && item.status === StatusCinemaTicket['active'])
        cinemaTicket = user.cinemaTicket
        cinemaTicket[index].status = StatusCinemaTicket['canceled']
      }
      const response = await prismadbClient.user.update({
        where: { id: user.id },
        data: {
          cinemaTicket: cinemaTicket
        }
      })

      return res.status(200).json(response.cinemaTicket)
    }
    else {
      return res.status(405).end()
    }
  } catch(error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` })
  }
}