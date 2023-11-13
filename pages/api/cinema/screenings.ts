import { NextApiRequest, NextApiResponse } from 'next';
import { CreateScreening, UpdateScreening } from '../../../types/cinema';
import prismadbClient from '../../../libs/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { cinemaId, dayBookTicket } = req.query as any
      const screening = await prismadbClient.screenings.findFirst({
        where: {
          cinemaId: cinemaId,
          dayBookTicket: dayBookTicket,
        }
      });

      if (!screening) {
        return res.status(400).json({ error: 'Suất chiếu không tồn tại' });
      }

      return res.status(200).json(screening);
    } else if (req.method === 'POST') {
      const data = req.body as CreateScreening;
      const screening = await prismadbClient.screenings.findFirst({
        where: {
          cinemaId: data.cinemaId,
          dayBookTicket: data.dayBookTicket,
        },
      });
      if (screening) {
        return res.status(400).json({ error: 'Suất chiếu đã tồn tại trong hệ thống' });
      }
      const response = await prismadbClient.screenings.create({
        data: {
          cinemaId: data.cinemaId,
          dayBookTicket: data.dayBookTicket,
          types: data.types,
          movieScreenTimes: data.movieScreenTimes
        },
        include: {
          cinema: {
            include: {
              province: true
            }
          }
        }
      });

      return res.status(200).json(response);
    } else if (req.method === 'PUT') {
      const data = req.body as UpdateScreening;
      const screening = await prismadbClient.screenings.findFirst({
        where: {
          cinemaId: data.cinemaId,
          dayBookTicket: data.dayBookTicket,
        },
      });
      if (!screening) {
        return res.status(400).json({ error: 'Suất chiếu không tồn tại trong hệ thống' });
      }
      const response = await prismadbClient.screenings.update({
        where: {
          id: data.id
        },
        data: {
          cinemaId: data.cinemaId,
          dayBookTicket: data.dayBookTicket,
          types: data.types,
          movieScreenTimes: data.movieScreenTimes
        },
        include: {
          cinema: {
            include: {
              province: true
            }
          }
        }
      });

      return res.status(200).json(response);
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Id là bắt buộc' });
      }
      const screening = await prismadbClient.screenings.delete({
        where: {
          id: id as string,
        },
      });

      return res.status(200).json(screening);
    } else {
      return res.status(405).end();
    }
  } catch (error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` });
  }
}
