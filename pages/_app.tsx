import '@/styles/globals.css';
import '@styles/navbar.css';
import '@styles/footer.css';
import '@/styles/discover.css';
import '@/styles/category.css';
import '@/styles/movies.css';
import '@/styles/trending.css';
import '@/styles/detail_movie.css';
import '@/styles/movie_item.css';
import '@/styles/not_found.css';
import NextHead from '@/components/Common/NextHead/NextHead';
import { useStore } from 'react-redux';
import { SessionProvider } from 'next-auth/react'
import { AppPropsWithLayout } from '@/types/common';
import NextNProgress from 'nextjs-progressbar';
import { PersistGate } from 'redux-persist/integration/react';
import { wrapper } from '@/redux/store';
import Theme from '@/styles/theme';

function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
  const store: any = useStore();

  return Theme(
    <>
      <NextHead />
      <PersistGate persistor={store.__persistor} loading={<div>Loading</div>}>
        <SessionProvider session={session} refetchOnWindowFocus={false} refetchInterval={10 * 60} >
          <NextNProgress color="#0bcb6b" startPosition={0.1} stopDelayMs={200} height={2} showOnShallow={true} />
          <Component {...pageProps} />
        </SessionProvider>
      </PersistGate>
      <Component {...pageProps} />
    </>
  );
}
export default wrapper.withRedux(App);
