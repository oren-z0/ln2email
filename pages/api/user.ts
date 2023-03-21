import type { NextApiRequest, NextApiResponse } from 'next';
import { updateUser } from '@/lib/api/user';
import { getSession } from 'next-auth/react';
import fetch from 'node-fetch';
import { bech32 } from 'bech32';

const maxLightningAddressLength = 320;
const nip19pukeyLength = 63;

interface LnurlpJson {
  callback?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    const { lightningAddress, bech32pubkey } = req.body || {};
    const session = await getSession({ req });
    if (!session || !session.user?.email) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }
    if (lightningAddress !== undefined && typeof lightningAddress !== 'string') {
      return res.status(422).json({
        reason: 'Update failed: Unprocessable JSON Body: lightningAddress'
      });
    }
    if (lightningAddress) {
      if (lightningAddress.length > maxLightningAddressLength) {
        return res.status(422).json({ reason: 'Update failed: Lightning address is too long' });
      }
      const lightningParts = lightningAddress.split('@');
      if (lightningParts.length !== 2) {
        return res.status(422).json({ reason: 'Update failed: Malformed lightning address' });
      }
      const [username, domain] = lightningParts;
      if (!domain) {
        return res.status(422).json({
          reason: 'Update failed: Malformed lightning address host'
        });
      }
      if (domain.toLowerCase().endsWith('.onion')) {
        return res.status(422).json({
          reason: 'Update failed: Onion addresses are not supported'
        });
      }
      try {
        const targetUrl = `https://${domain}/.well-known/lnurlp/${username}`;
        console.info(`Sending GET to ${targetUrl}`);
        const fetchResponse = await fetch(targetUrl);
        if (!fetchResponse.ok) {
          console.info(`GET failed with status ${fetchResponse.status}`);
          return res.status(403).json({
            reason: 'Update failed: Lightning address domain responded with bad status code'
          });
        }
        const fetchResponseJson = (await fetchResponse.json()) as LnurlpJson;
        if (!fetchResponseJson.callback) {
          return res.status(403).json({
            reason: 'Update failed: Lightning address domain responded with bad callback'
          });
        }
      } catch (error) {
        console.error(`GET Failed: ${error}`);
        return res.status(403).json({
          reason: 'Update failed: Lightning address domain request failed'
        });
      }
    }
    let nip05pubkey: string | undefined;
    if (bech32pubkey !== undefined && typeof bech32pubkey !== 'string') {
      return res.status(422).json({
        reason: 'Update failed: Unprocessable JSON Body: bech32pubkey'
      });
    }
    if (bech32pubkey) {
      if (bech32pubkey.length !== nip19pukeyLength) {
        return res.status(422).json({
          reason: 'Update failed: Bad NIP-19 public key length, must look like: npub...'
        });
      }
      try {
        const { prefix, words } = bech32.decode(bech32pubkey);
        if (prefix !== 'npub') {
          console.error(`Unexpected bech32pubkey prefix: ${prefix}`);
          throw new Error('Wrong prefix');
        }
        nip05pubkey = Buffer.from(bech32.fromWords(words)).toString('hex');
      } catch (error) {
        console.error(`Failed to parse bech32pubkey: ${error}`);
        return res.status(422).json({
          reason: 'Update failed: Bad NIP-19 public key, must look like: npub...'
        });
      }
    } else if (bech32pubkey === '') {
      nip05pubkey = '';
    }
    try {
      await updateUser(session.user.email, { lightningAddress, nip05pubkey });
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
