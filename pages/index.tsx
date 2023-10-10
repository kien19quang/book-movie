import Navbar from '@/components/Organisms/Navbar';
import DiscoverMovies from '@/components/Organisms/DiscoverMovies';
import CategoryMovies from '@/components/Organisms/CategoryMovies';
import TrendingMovies from '@/components/Organisms/TrendingMovies';
import Movies from '@/components/Organisms/Movies';
import Footer from '@/components/Organisms/Footer';
import { NextPageContext } from 'next/types';
import { getSession } from 'next-auth/react';

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
