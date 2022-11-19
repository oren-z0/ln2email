import type { NextApiRequest, NextApiResponse } from 'next';
import { getUser } from '@/lib/api/user';

const suffix = '.ln2.email';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { emailuser } = req.query;
  
  if (req.method === 'GET') {
    const host = req.headers.host ?? '';
    if (process.env.NODE_ENV !== 'development') {
      if (!host || !host.endsWith(suffix)) {
        return res.status(404).json({
          reason: 'Not found'
        });
      }  
    }
    // If you run under 
    const email = `${emailuser}@${
      (process.env.NODE_ENV === 'development') ? host : host.slice(0, -suffix.length)
    }`;
    const user = await getUser(email);
    if (!user || !user.verified || !user.lightningAddress) {
      return res.status(404).json({
        reason: 'Not found',
        email
      });
    }

    const searchParams = (req.url ?? '').split('?').slice(1).join('?');

    const [lightningUsername, lightningDomain] = user.lightningAddress.split('@');
    if (!lightningDomain) {
      // Unexpected
      return res.status(500).json({
        reason: 'Malformed lightning address'
      });
    }

    return res.redirect(
      307,
      `${
        lightningDomain.toLowerCase().endsWith('.onion') ? 'http' : 'https'
      }://${lightningDomain}/.well-known/lnurlp/${lightningUsername}${
        searchParams && `?${searchParams}`
      }`
    );
  }
  return res.status(405).json({
    reason: 'Method not allowed'
  });
}
