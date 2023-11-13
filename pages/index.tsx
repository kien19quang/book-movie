import { NextPageContext } from 'next/types';
import { getSession } from 'next-auth/react';
import CategoryMovies from '../components/MovieComponent/CategoryMovies';
import DiscoverMovies from '../components/MovieComponent/DiscoverMovies';
import Movies from '../components/MovieComponent/Movies';
import Navbar from '../components/MovieComponent/Navbar';
import TrendingMovies from '../components/MovieComponent/TrendingMovies';
import Footer from '../components/MovieComponent/Footer';
import serverAuth from '../libs/serverAuth';
import { isEmpty } from 'lodash';
import prismadbClient from '../libs/prismadb';

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
  const user = await prismadbClient.user.findUnique({
    where: {
      id: session?.user.id || ''
    }
  })

  if (!session || !user) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      }
    }
  }
  console.log(user)

  if (user.role === 'ADMIN') {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}
