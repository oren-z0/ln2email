import { GetStaticProps } from 'next';
import Home from '@/components/home';

export default function Index() {
  return <Home />;
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 10
  };
};
