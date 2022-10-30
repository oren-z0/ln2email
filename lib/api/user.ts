import clientPromise from '@/lib/mongodb';

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
        unsubscribeAll: 1
      }
    }
  );
  if (!results) {
    return null;
  }
  const { emailVerified, ...userProps } = results;
  return {
    ...userProps,
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
  unsubscribeAll?: boolean;
}

export async function updateUser(email: string, {
  lightningAddress,
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
        ...!lightningAddress && {
          lightningAddress: 1
        }
      },
      $set: {
        ...lightningAddress && {
          lightningAddress
        },
        ...other
      }
    })
  )
}
