import Navbar from '@/components/Organisms/Navbar';
import DiscoverMovies from '@/components/Organisms/DiscoverMovies';
import CategoryMovies from '@/components/Organisms/CategoryMovies';
import TrendingMovies from '@/components/Organisms/TrendingMovies';
import Movies from '@/components/Organisms/Movies';
import Footer from '@/components/Organisms/Footer';

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
