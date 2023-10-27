import Link from 'next/link';
import ButtonTheme from '../components/MovieComponent/Navbar/ButtonTheme';

export default function PageNotFound() {
  return (
    <div className="not-found">
      <div className="text-center">
        <img src="/image/404-not-found.svg" width={500} height={250} alt='Not Found' />
        <h1 className="my-3">Page Not Found</h1>
        <Link href="/" legacyBehavior>
          <a className="btn btn-outline-purple">
            Homepage
          </a>
        </Link>
      </div>
      <div className="d-none">
        <ButtonTheme />
      </div>
    </div>
  );
}
