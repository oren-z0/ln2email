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
      lightningAddress: ''
    });
    return res.status(200).json({});
  }
  return res.status(405).json({
    reason: 'Method not allowed'
  });
}
