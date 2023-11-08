import { BaseApi } from "../../configs/axiosConfig";

const ApiMovie = new BaseApi('https://api.themoviedb.org/3', {
  api_key: process.env.NEXT_PUBLIC_API_KEY || '183afbe1b192cfa0271b515c8f977b96',
  language: process.env.NEXT_LANGUAGE || 'vi-VN'
})

export async function getCategories() {
  const response = await ApiMovie.GET(`/genre/movie/list`);
  return response;
}

export async function getDetailMovie(idm: number) {
  const response = await ApiMovie.GET(`/movie/${idm}`);
  return response;
}

export async function getVideoTrailer(idm:number) {
  const response = await ApiMovie.GET(`/movie/${idm}/videos`, { language: 'en-US' });
  return response;
}

export async function getSimilarMovies(idm: number) {
  const response = await ApiMovie.GET(`/movie/${idm}/similar`);
  return response;
}

export async function getCategoryMovies(idc: number, page = 1) {
  const response = await ApiMovie.GET(`/discover/movie?with_genres=${idc}&page=${page}`);
  return response;
}

export async function getTrendingMovies(param: string, page = 1) {
  const response = await ApiMovie.GET(`/trending/movie/${param}?page=${page}`);
  return response;
}

export async function getMovies(param: string, page = 1) {
  const response = await ApiMovie.GET(`/movie/${param}?page=${page}`);
  return response;
}

export async function getResultMovies(query: string) {
  const response = await ApiMovie.GET(`/search/movie?query=${query}`);
  return response;
}

export async function getCredits(idm: number) {
  const response = await ApiMovie.GET(`/movie/${idm}/credits`);
  return response;
}
