import axios from 'axios';
import ApiClient from '../../configs/axiosConfig';

const keyAPI = process.env.NEXT_PUBLIC_KEY;
export async function getCategories() {
  const response = await ApiClient.GET(`/genre/movie/list`);
  return response;
}

export async function getDetailMovie(idm: number) {
  const response = await ApiClient.GET(`/movie/${idm}`);
  return response;
}

export async function getVideoTrailer(idm:number) {
  const response = await ApiClient.GET(`/movie/${idm}/videos`);
  return response;
}

export async function getSimilarMovies(idm: number) {
  const response = await ApiClient.GET(`/movie/${idm}/similar`);
  return response;
}

export async function getCategoryMovies(idc: number, page = 1) {
  const response = await ApiClient.GET(`/discover/movie?with_genres=${idc}&page=${page}`);
  return response;
}

export async function getTrendingMovies(param: string, page = 1) {
  const response = await ApiClient.GET(`/trending/movie/${param}?page=${page}`);
  return response;
}

export async function getMovies(param: string, page = 1) {
  const response = await ApiClient.GET(`/movie/${param}?page=${page}`);
  return response;
}

export async function getResultMovies(query: string) {
  const response = await ApiClient.GET(`/search/movie?query=${query}`);
  return response;
}

export async function getCredits(idm: number) {
  const response = await ApiClient.GET(`/movie/${idm}/credits`);
  return response;
}
