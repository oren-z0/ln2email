import '@/styles/globals.css';
import { AppProps } from 'next/app';
import { Session } from "next-auth";
import { SessionProvider } from 'next-auth/react';
import Layout, { LayoutProps } from '@/components/layout';

interface MyAppProps extends LayoutProps {
  session: Session;
}

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps<MyAppProps>) {
  return (
    <SessionProvider session={session}>
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
