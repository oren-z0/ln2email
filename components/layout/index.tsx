import styled from 'styled-components';
import { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { LoadingDots } from '@/components/icons';

const defaultMetaProps = {
  name: 'LN2EMAIL',
  title: 'Lightning to Email',
  description:
    'Forward lightning payments from your email address + ".ln2.email" to your wallet address.',
  ogImage: 'https://ln2.email/og.png',
  ogUrl: 'https://ln2.email'
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export interface LayoutProps {
  children: ReactNode;
}

export default function Layout({
  children
}: LayoutProps) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div>
        <LoadingDots color="white" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{defaultMetaProps.title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
        <meta name="theme-color" content="#7b46f6" />

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta itemProp="name" content={defaultMetaProps.name} />
        <meta itemProp="description" content={defaultMetaProps.description} />
        <meta itemProp="image" content={defaultMetaProps.ogImage} />
        <meta name="description" content={defaultMetaProps.description} />
        <meta property="og:title" content={defaultMetaProps.title} />
        <meta property="og:description" content={defaultMetaProps.description} />
        <meta property="og:url" content={defaultMetaProps.ogUrl} />
        <meta property="og:image" content={defaultMetaProps.ogImage} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Vercel" />
        <meta name="twitter:creator" content="@ln2email" />
        <meta name="twitter:title" content={defaultMetaProps.title} />
        <meta name="twitter:description" content={defaultMetaProps.description} />
        <meta name="twitter:image" content={defaultMetaProps.ogImage} />
      </Head>
      <Wrapper>
        {children}
      </Wrapper>
    </>
  );
}
