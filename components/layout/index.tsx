import { useState, ReactNode } from 'react';
import { ResultProps } from '@/lib/api/user';
import Toast from '@/components/layout/toast';
import Meta, { MetaProps } from '@/components/layout/meta';
import { useRouter } from 'next/router';
import { LoadingDots } from '@/components/icons';

export default function Layout({
  meta,
  results,
  totalUsers,
  children
}: {
  meta: MetaProps;
  results: ResultProps[];
  totalUsers: number;
  username?: string;
  children: ReactNode;
}) {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (router.isFallback) {
    return (
      <div className="h-screen w-screen flex justify-center items-center bg-black">
        <LoadingDots color="white" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto h-screen flex overflow-hidden bg-black">
      <Meta props={meta} />
      <Toast />
      <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
        <div className="flex-1 relative z-0 flex overflow-hidden">
          <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
