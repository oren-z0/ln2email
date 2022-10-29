import { GetServerSideProps } from 'next';
import { getProviders, getCsrfToken } from 'next-auth/react';
import SigninPage from '@/components/signin';

export default SigninPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = Object.values(
    (await getProviders()) ?? {}
  ).sort((p1, p2) => (p1.id < p2.id) ? -1 : 1);
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      providers,
      csrfToken,
      error: context.query.error ?? '',
      callbackUrl: context.query.callbackUrl ?? '',
    },
  }
};
