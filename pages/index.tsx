import { GetStaticProps } from 'next';
import Home, { HomeProps } from '@/components/home';
import {
  getUserCount
} from '@/lib/api/user';
import { defaultMetaProps } from '@/components/layout/meta';
import clientPromise from '@/lib/mongodb';

export default function Index({ totalUsers }: HomeProps) {
  return <Home totalUsers={totalUsers} />;
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    await clientPromise;
  } catch (e: any) {
    throw new Error(`Connection limit reached. Please try again later.`);
  }

  const totalUsers = await getUserCount();

  return {
    props: {
      meta: defaultMetaProps,
      totalUsers
    },
    revalidate: 10
  };
};
