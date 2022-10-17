import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from 'lib/mongodb';

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    EmailProvider({
      server: process.env.SMTP_SERVER,
      from: 'no-reply@ln2.email',
      maxAge: 600
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.userId = user.id;
      session.userEmaileVerified = user.emailVerified;
      return session;
    }
  },
  session: {
    maxAge: 3600,
    updateAge: 600
  }
});
