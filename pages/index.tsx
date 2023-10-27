import { NextPageContext } from 'next/types';
import { getSession } from 'next-auth/react';
import CategoryMovies from '../components/MovieComponent/CategoryMovies';
import DiscoverMovies from '../components/MovieComponent/DiscoverMovies';
import Movies from '../components/MovieComponent/Movies';
import Navbar from '../components/MovieComponent/Navbar';
import TrendingMovies from '../components/MovieComponent/TrendingMovies';
import Footer from '../components/MovieComponent/Footer';

export default function Home() {

  return (
    <>
      <Navbar />
      <DiscoverMovies />
      <CategoryMovies />
      <TrendingMovies />
      <Movies />
      <Footer />
    </>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}
