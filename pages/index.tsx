import { NextPageContext } from 'next/types';
import { getSession } from 'next-auth/react';
import CategoryMovies from '../components/organisms/CategoryMovies';
import DiscoverMovies from '../components/organisms/DiscoverMovies';
import Movies from '../components/organisms/Movies';
import Navbar from '../components/organisms/Navbar';
import TrendingMovies from '../components/organisms/TrendingMovies';
import Footer from '../components/organisms/Footer';

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
  console.log("check", context)

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
