import { GetServerSideProps } from 'next';
import clientPromise from '@/lib/mongodb';
import { getSession } from 'next-auth/react';
import { getUser, UserProps } from '@/lib/api/user';
import UserProfile from '@/components/user-profile';
import { bech32 } from 'bech32';


interface ProfileProps {
  user: UserProps;
}

export default function Profile({ user }: ProfileProps) {
  return <UserProfile user={user} />
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session || !session.user?.email) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    };
  }

  try {
    await clientPromise;
  } catch (e: any) {
    console.error(e);
    throw new Error('Connection limit reached. Please try again later.');
  }

  const user = await getUser(session.user.email);
  if (!user || !user.verified) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      user,
      bech32pubkey: user.nip05pubkey && bech32.encode(
        'npub',
        bech32.toWords(Buffer.from(user.nip05pubkey, 'hex'))
      ),      
    }
  };
};
