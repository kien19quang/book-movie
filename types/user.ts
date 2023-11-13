import { IOption } from "./cinema";

export interface CreateCinemaTicketDto {
  userId: string;
  movieId: number;
  title: string;
  overview: string;
  thumbnailUrl: string;
  status: StatusCinemaTicket;
  voteCount: number;
  voteAverage: number;
  quantity: number;
  ticketPrice: number;
  provinceId?: number,
  cinemaId?: string,
  dayBookTicket?: string,
  type?: string,
  movieScreenTime?: string
}

export interface ITicketPurchase {
  userId: string;
  movieId: number;
  status: StatusCinemaTicket
}

export enum StatusCinemaTicket {
  pending = 'pending',
  active = 'active',
  completed = 'completed',
  canceled = 'canceled'
}

export interface ICinemaTicket {
  id: number;
  title: string
  overview: string
  thumbnailUrl: string
  status: StatusCinemaTicket
  voteCount: number;
  voteAverage: number;
  ticketPrice: number;
  quantity: number;
  createdAt: Date
  updatedAt: Date
}

export interface IUser {
  id: string;
  name: string;
  email: string;
}