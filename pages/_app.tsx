import '@/styles/globals.css';
import { AppProps } from 'next/app';
import { Session } from "next-auth";
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'styled-components';
import Layout from '@/components/layout';

const theme = {
  colors: {
    primary: '#0070f3',
    primaryLight: 'rgba(0,118,255,0.9)',
    primaryLighter1: 'rgba(0,118,255,0.39)',
    primaryLighter2: 'rgba(0,118,255,0.23)',
    primaryLightest: 'rgba(0,118,255,0.1)',
  },
};

interface MyAppProps {
  session: Session;
}

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps<MyAppProps>) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <SessionProvider session={session}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </ThemeProvider>
    </>
  );
}
