import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { MongoDBAdapter } from '@/lib/mongodb-adapter';
import createClient from '@/lib/mongodb';
import tlds from '@/lib/tlds-autogenerated.json';
import { getUser } from '@/lib/api/user';
import { sendVerificationRequest } from '@/lib/email';

const tldsSet = new Set(tlds);

export default NextAuth({
  adapter: MongoDBAdapter(createClient),
  providers: [
    EmailProvider({
      server: process.env.SMTP_SERVER,
      from: 'no-reply@ln2.email',
      maxAge: 600,
      sendVerificationRequest,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      Object.assign(session, {
        userId: user.id,
      });
      return session;
    },
    async signIn({ user }) {
      try {
        if (!user.email) {
          return './?error=default';
        }
        const emailParts = user.email.split('@');
        if (emailParts.length !== 2) {
          return './?error=default';
        }
        const userDocument = await getUser(user.email);
        if (userDocument?.unsubscribeAll) {
          return './?error=Unsubscribed';
        }
        const [, domain] = emailParts;
        const domainSuffix = domain.split('.').slice(1).join('.');
        if (!tldsSet.has(domainSuffix)) {
          return './?error=UnsupportedTld';
        }
        if (process.env.NODE_ENV !== 'development') {
          const subdomain = `*.${domainSuffix}.ln2.email`;
          const domainResponse = await fetch(
            `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${subdomain}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
                'Content-Type': 'application/json',
              }
            }
          );
          if (!domainResponse.ok) {
            if (domainResponse.status !== 404) {
              console.error(`Failed to check subdomain: ${domainResponse.status}`);
              return './?error=FailedToRegisterTld';
            }
            const addSubdomainResponse = await fetch(
              `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains`,
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: subdomain })
              }
            );
            if (!addSubdomainResponse.ok) {
              console.error(`Failed to add subdomain: ${domainResponse.status}`);
              return './?error=FailedToRegisterTld';
            }
            await addSubdomainResponse.json();
          }
        }
      } catch (error) {
        console.error(`Auth signin failed: ${error}`);
        return './?error=default';
      }
      return true;
    }
  },
  pages: {
    signIn: '/signin'
  },
  session: {
    maxAge: 3600,
    updateAge: 600
  },
  theme: {
    brandColor: '#F7931A',
    logo: `${
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://ln2.email'
    }/logo.svg`
  },
});
