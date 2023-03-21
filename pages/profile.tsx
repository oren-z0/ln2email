import { GetServerSideProps } from 'next';
import clientPromise from '@/lib/mongodb';
import { getSession } from 'next-auth/react';
import { getUser, UserProps } from '@/lib/api/user';
import UserProfile from '@/components/user-profile';
import { bech32 } from 'bech32';


interface ProfileProps {
  user: UserProps;
  nip05pubkeyBech32?: string;
}

export default function Profile({ user, nip05pubkeyBech32 }: ProfileProps) {
  return <UserProfile user={user} nip05pubkeyBech32={nip05pubkeyBech32} />
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
      ...user.nip05pubkey && {
        nip05pubkeyBech32: bech32.encode(
          'npub',
          bech32.toWords(Buffer.from(user.nip05pubkey, 'hex'))
        ),  
      }
    }
  };
};
