import { GetServerSideProps } from 'next';
import { verifyUnsubscribeToken } from '@/lib/jwt';
import Unsubscribe from '@/components/unsubscribe';

export default Unsubscribe;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = context.params ?? {};
  const email = (typeof token === 'string') && verifyUnsubscribeToken(token);
  if (!email) {
    return {
      notFound: true
    };
  }
  return {
    props: {
      email,
      token
    }
  };
};
