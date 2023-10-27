import Footer from "../../components/MovieComponent/Footer";
import Navbar from "../../components/MovieComponent/Navbar";
import ResultMovies from "../../components/MovieComponent/ResultMovies";
import { getResultMovies } from "../../services/data_api";
import { DetailMovieTypes } from "../../services/data_types";



interface SearchProps {
  keyword: string;
  movies: DetailMovieTypes[];
}

export default function Search({ keyword, movies }: SearchProps) {
  return (
    <>
      <Navbar />
      <ResultMovies keyword={keyword} movies={movies} />
      <Footer />
    </>
  );
}

interface GetServerSideProps {
  params: {
    keyword: string;
  };
}

export async function getServerSideProps({ params } : GetServerSideProps) {
  const { keyword } = params;
  const response: any = await getResultMovies(keyword);
  const movies = response.results;

  return {
    props: {
      keyword,
      movies,
    },
  };
}
