import type { NextApiRequest, NextApiResponse } from 'next';
import { updateUser } from 'lib/api/user';
import { getSession } from 'next-auth/react';

const maxLightningAddressLength = 320;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    const { lightningAddress } = req.body;
    const session = await getSession({ req });
    if (!session || !session.user?.email) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }
    if (
      (lightningAddress !== undefined) &&
      (
        (typeof lightningAddress !== 'string') ||
        (lightningAddress.length > maxLightningAddressLength)
      )
    ) {
      return res.status(422).end(`Unprocessable JSON Body`);
    }
    try {
      await updateUser(session.user.email, lightningAddress);
      return res.status(200).json({});
    } catch (e: any) {
      console.log(e);
      return res.status(500).json({
        error: e.toString()
      });
    }
  }
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
