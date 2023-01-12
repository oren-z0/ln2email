import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

export default function AuthCallback() {
  return <div>Auth Callback</div>;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: '/profile'
    }
  };
};
