import '../styles/globals.scss';
import '../styles/antdConfig.scss';
import '../styles/navbar.css';
import '../styles/footer.css';
import '../styles/discover.css';
import '../styles/category.css';
import '../styles/movies.css';
import '../styles/trending.css';
import '../styles/detail_movie.css';
import '../styles/movie_item.css';
import { useStore } from 'react-redux';
import { SessionProvider, getSession } from 'next-auth/react'
import NextNProgress from 'nextjs-progressbar';
import { PersistGate } from 'redux-persist/integration/react';
import { NextPageContext } from 'next/types';
import NextHead from '../components/Common/NextHead/NextHead';
import { wrapper } from '../redux/store';
import Theme from '../styles/theme';
import { AppPropsWithLayout } from '../types/common';
import EmptyLayout from '../layouts/EmptyLayout/EmptyLayout';

function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
  const store: any = useStore();
  const Layout = Component.Layout ?? EmptyLayout;

  return Theme(
    <>
      <NextHead />
      <PersistGate persistor={store.__persistor} loading={<div>Loading</div>}>
        <SessionProvider session={session} refetchOnWindowFocus={false} refetchInterval={10 * 60} >
          <Layout>
            <NextNProgress color="#0bcb6b" startPosition={0.1} stopDelayMs={200} height={2} showOnShallow={true} />
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </PersistGate>
    </>
  );
}

export default wrapper.withRedux(App);
