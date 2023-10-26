import { NextPageContext } from 'next/types';
import { getSession } from 'next-auth/react';
import CategoryMovies from '../components/Organisms/CategoryMovies';
import DiscoverMovies from '../components/Organisms/DiscoverMovies';
import Movies from '../components/Organisms/Movies';
import Navbar from '../components/Organisms/Navbar';
import TrendingMovies from '../components/Organisms/TrendingMovies';
import Footer from '../components/Organisms/Footer';

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
