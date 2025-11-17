import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default function AuthCallback() {
  return <div>Auth Callback</div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
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
