import type { NextApiRequest, NextApiResponse } from 'next';
import { getUser } from '@/lib/api/user';

const suffix = '.ln2.email';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method === 'GET') {
    if (typeof name !== 'string') {
      return res.status(422).json({
        reason: 'Invalid name query param'
      });
    }
    const host = req.headers.host ?? '';
    if (process.env.NODE_ENV !== 'development') {
      if (!host || !host.endsWith(suffix)) {
        return res.status(404).json({
          reason: 'Not found'
        });
      }
    }
    const email = `${name}@${
      (process.env.NODE_ENV === 'development') ? host : host.slice(0, -suffix.length)
    }`;
    const user = await getUser(email);
    if (!user || !user.verified || !user.nip05pubkey) {
      return res.status(404).json({
        reason: 'Not found',
        email
      });
    }

    return res.json({
      names: {
        [name]: user.nip05pubkey,
      }
    });
  }
  return res.status(405).json({
    reason: 'Method not allowed'
  });
}
