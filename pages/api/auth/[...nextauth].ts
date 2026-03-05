import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

const nextAuthHandler = NextAuth(authOptions);

async function verifyTurnstile(token: string): Promise<boolean> {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token
      })
    }
  );
  const data = await response.json();
  return data.success === true;
}

export default async function auth(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const nextauth = req.query.nextauth as string[];
  const isEmailSignin =
    req.method === 'POST' && nextauth?.join('/') === 'signin/email';

  if (isEmailSignin && process.env.TURNSTILE_SECRET_KEY) {
    const token = req.body?.['cf-turnstile-response'];
    if (!token || !(await verifyTurnstile(token))) {
      res.redirect(302, '/signin?error=BotDetected');
      return;
    }
  }

  return nextAuthHandler(req, res);
}
