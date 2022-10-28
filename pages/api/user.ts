import type { NextApiRequest, NextApiResponse } from 'next';
import { updateUser } from 'lib/api/user';
import { getSession } from 'next-auth/react';

const maxLightningAddressLength = 320;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    const { lightningAddress } = req.body || {};
    const session = await getSession({ req });
    if (!session || !session.user?.email) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }
    if (typeof lightningAddress === 'string') {
      if (lightningAddress.length > maxLightningAddressLength) {
        return res.status(422).json({ reason: 'Update failed: Lightning address is too long' });
      }
      const lightningParts = lightningAddress.split('@');
      if (lightningParts.length !== 2) {
        return res.status(422).json({ reason: 'Update failed: Malformed lightning address' });
      }
      // TODO: send a GET to verify that lightning address is valid
    } else if (lightningAddress !== undefined) {
      return res.status(422).json({ reason: 'Update failed: Unprocessable JSON Body' });
    }
    try {
      await updateUser(session.user.email, lightningAddress);
      return res.status(200).json({});
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({
        reason: 'Update failed: Internal error'
      });
    }
  }
  return res.status(405).json({
    reason: 'Method not allowed'
  });
}
