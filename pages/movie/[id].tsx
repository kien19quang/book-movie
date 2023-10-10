import Footer from '@/components/Organisms/Footer';
import SectionHeader from '@/components/Organisms/DetailMovieContent/SectionHeader';
import SectionInfo from '@/components/Organisms/DetailMovieContent/SectionInfo';
import SectionRecom from '@/components/Organisms/DetailMovieContent/SectionRecom';
import VideoTrailer from '@/components/Organisms/DetailMovieContent/VideoTrailer';
import Navbar from '@/components/Organisms/Navbar';
import { getDetailMovie, getVideoTrailer, getSimilarMovies, getCredits } from '@/services/data_api';
import { DetailMovieTypes } from '@/services/data_types';

interface DetailMovieProps {
  movie: DetailMovieTypes;
  similarMovies: DetailMovieTypes[];
  credits: any;
  trailer: {
    key: string;
  }
}

export default function DetailMovie(props: DetailMovieProps) {
  const {
    movie, similarMovies, trailer, credits,
  } = props;
  const rootImg = process.env.NEXT_PUBLIC_IMG;

  return (
    <>
      <div className="d-none">
        <Navbar />
      </div>
      <div className="detail-movie mb-5">
        <div className="section-backdrop">
          <img style={{ width: '100%', height: '100%' }} src={`${rootImg}/w1280/${movie?.backdrop_path}`} alt={`backdrop ${movie?.title}`} />
        </div>
        <div className="section-content">
          <SectionHeader movie={movie} />
          <SectionInfo movie={movie} credits={credits} />
          <SectionRecom similarMovies={similarMovies} />
        </div>
        <div className="overlay">
          <VideoTrailer trailer={trailer} />
        </div>
      </div>
      <Footer />
    </>
  );
}

interface GetStaticProps {
    params: {
        id: number;
    }
}

export async function getServerSideProps({ params }: GetStaticProps) {
  const { id } = params;

  const movie = await getDetailMovie(id);
  const videosMovie:any = await getVideoTrailer(id);
  const trailer = videosMovie?.results?.filter((result: any) => result.type === 'Trailer')[0] || null;
  const similarMovies:any = await getSimilarMovies(id);
  const credits = await getCredits(id);

  return {
    props: {
      movie,
      trailer,
      credits,
      similarMovies: similarMovies.results,
    },
  };
}
