import { NextApiRequest, NextApiResponse } from "next";
import { ITicketPurchase, StatusCinemaTicket } from "../../../../types/user";
import prismadbClient from "../../../../libs/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'PUT') {
      const data  = req.body as ITicketPurchase
      if (!data.movieId || !data.userId) {
        return res.status(400).json({ error: 'Movie Id và User Id là bắt buộc' });
      }
      const user = await prismadbClient.user.findUnique({ where: { id: data.userId } })
      if (!user) {
        return res.status(400).json({ error: 'User này không tồn tại trong hệ thống' });
      }
      const listCinemaTicket = user.cinemaTicket
      const idxCinemaTicket = listCinemaTicket.findIndex(item => item.id === data.movieId && item.status === StatusCinemaTicket['active'])
      if (idxCinemaTicket > -1) {
        listCinemaTicket[idxCinemaTicket].status = data.status
      }

      const response = await prismadbClient.user.update({
        where: { id: user.id },
        data: {
          cinemaTicket: listCinemaTicket,
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