import '@/styles/globals.css';
import { AppProps } from 'next/app';
import { Session } from "next-auth";
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'styled-components';
import Layout from '@/components/layout';

const theme = {
  colors: {
    primary: 'rgb(247,147,26)',
    primaryLight: 'rgba(247,147,26,0.9)',
    primaryLighter1: 'rgba(247,147,26,0.39)',
    primaryLighter2: 'rgba(247,147,26,0.23)',
    primaryLightest: 'rgba(247,147,26,0.1)',
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
