import ButtonTheme from '@/components/Organisms/Navbar/ButtonTheme';
import img from 'next/image';
import Link from 'next/link';

export default function PageNotFound() {
  return (
    <div className="not-found">
      <div className="text-center">
        <img style={{ width: '100%', height: '100%' }} src="/image/404-not-found.svg" width={500} height={250} alt='Not Found' />
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
