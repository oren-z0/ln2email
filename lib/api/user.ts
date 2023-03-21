import clientPromise from '@/lib/mongodb';
import { bech32 } from 'bech32';

export interface UserProps {
  email: string;
  verified: boolean;
  lightningAddress?: string;
  unsubscribeAll?: boolean;
}

export interface ResultProps {
  _id: string;
  users: UserProps[];
}

export async function getUser(email: string): Promise<UserProps | null> {
  const client = await clientPromise;
  const collection = client.db().collection('users');
  const results = await collection.findOne(
    { email },
    {
      projection: {
        _id: 0,
        email: 1,
        emailVerified: 1,
        lightningAddress: 1,
        nip05pubkey: 1,
        unsubscribeAll: 1
      }
    }
  );
  if (!results) {
    return null;
  }
  const { emailVerified, nip05pubkey, ...userProps } = results;
  return {
    ...userProps,
    bech32pubkey: nip05pubkey && bech32.encode(
      'npub',
      bech32.toWords(Buffer.from(nip05pubkey, 'hex'))
    ),
    verified: Boolean(emailVerified),
  };
}

function ignoreEmptyValues<T>(record: Record<string,T>): Record<string,T> {
  return Object.fromEntries(
    Object.entries(record).filter(
      ([, value]) => (value !== undefined) && (!value || Object.keys(value).length > 0)
    )
  );
}

interface UpdateUserProps {
  lightningAddress?: string;
  nip05pubkey?: string;
  unsubscribeAll?: boolean;
}

export async function deleteUserSessions(email: string) {
  const client = await clientPromise;
  const usersCollection = client.db().collection('users');
  const userDocument = await usersCollection.findOne(
    { email },
    {
      projection: {
        _id: 1,
      }
    }
  );
  if (!userDocument) {
    return;
  }
  const sessionsCollection = client.db().collection('sessions');
  await sessionsCollection.deleteMany({
    userId: userDocument._id
  });
}

export async function updateUser(email: string, {
  lightningAddress,
  nip05pubkey,
  ...other
}: UpdateUserProps) {
  const client = await clientPromise;
  const collection = client.db().collection('users');
  await collection.updateOne(
    {
      email
    },
    ignoreEmptyValues({
      $unset: {
        ...lightningAddress === '' && {
          lightningAddress: 1
        },
        ...nip05pubkey === '' && {
          nip05pubkey: 1
        }
      },
      $set: {
        ...lightningAddress && {
          lightningAddress
        },
        ...nip05pubkey && {
          nip05pubkey
        },
        ...other
      }
    })
  )
}
