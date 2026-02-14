import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteUserSessions, updateUser } from '@/lib/api/user';
import { verifyUnsubscribeToken } from '@/lib/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { token } = req.body || {};
    if (typeof token !== 'string') {
      return res.status(422).json({
        reason: 'Bad token'
      });
    }
    const email = verifyUnsubscribeToken(token);
    if (!email) {
      return res.status(422).json({
        reason: 'Bad token'
      });
    }
    await deleteUserSessions(email);
    await updateUser(email, {
      unsubscribeAll: true,
      lightningAddress: '',
      nip05pubkey: ''
    });
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_USER_ID) {
      const [localPart, domainPart] = email.split('@');
      const masked =
        !domainPart || localPart.length <= 1
          ? email
          : `${localPart[0]}***${localPart[localPart.length - 1]}@${domainPart}`;
      try {
        await fetch(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_USER_ID,
              text: `User unsubscribed from all emails: ${masked}`,
            }),
          }
        );
      } catch (err) {
        console.error('Telegram notify failed:', err);
      }
    }
    return res.status(200).json({});
  }
  return res.status(405).json({
    reason: 'Method not allowed'
  });
}
