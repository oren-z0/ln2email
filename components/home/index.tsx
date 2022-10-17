import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { LoadingDots } from '@/components/icons';

export const profileWidth = 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8';

export interface HomeProps {
  totalUsers: number;
}

export default function Home({
  totalUsers
}: HomeProps) {
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen pb-20">
      <div>
        <div
          className="h-48 w-full lg:h-64"
        />
        <div
          className={`${profileWidth} -mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5`}
        >
          <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="flex min-w-0 flex-1 items-center space-x-2">
              <h1 className="text-2xl font-semibold text-white truncate">
                Map your email address to your lightning wallet.
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className={`${profileWidth} mt-16`}>
        {
          status !== 'loading' && (
            session?.user ? (
              <article className="mt-3 max-w-2xl text-sm tracking-wider leading-6 text-white font-mono prose prose-headings:text-white prose-a:text-white">
                Logged in as {session.user.email}
                <button
                  disabled={loading}
                  onClick={() => {
                    setLoading(true);
                    signOut();
                  }}
                  className={`${
                    loading
                      ? 'bg-gray-200 border-gray-300'
                      : 'bg-black hover:bg-white border-black'
                  } w-36 h-8 py-1 text-white hover:text-black border rounded-md text-sm transition-all`}
                >
                  {loading ? <LoadingDots color="gray" /> : 'Logout'}
                </button>
              </article>
            ) : (
              <button
                disabled={loading}
                onClick={() => {
                  setLoading(true);
                  signIn('email', { callbackUrl: '/profile', email: process.env.NEXT_PUBLIC_DEFAULT_EMAIL });
                }}
                className={`${
                  loading
                    ? 'bg-gray-200 border-gray-300'
                    : 'bg-black hover:bg-white border-black'
                } w-36 h-8 py-1 text-white hover:text-black border rounded-md text-sm transition-all`}
              >
                {loading ? <LoadingDots color="gray" /> : 'Log in with Email'}
              </button>
            )
          )
        }
      </div>
      <div className="flex justify-end w-full max-w-2xl">
        <p className="text-gray-400 font-mono text-sm">
          Total Users: {totalUsers}
        </p>
      </div>
    </div>
  );
}
