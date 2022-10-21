import { GetStaticProps } from 'next';
import Home from '@/components/home';
import clientPromise from '@/lib/mongodb';

export default function Index() {
  return <Home />;
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    await clientPromise;
  } catch (e: any) {
    throw new Error(`Connection limit reached. Please try again later.`);
  }

  return {
    props: {},
    revalidate: 10
  };
};
