import clientPromise from '@/lib/mongodb';

export interface UserProps {
  email: string;
  verified: boolean;
  lightningAddress?: string;
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

export async function updateUser(email: string, lightningAddress?: string) {
  const client = await clientPromise;
  const collection = client.db().collection('users');
  if (!lightningAddress) {
    return await collection.updateOne({ email }, { $unset: { lightningAddress: 1 } });  
  }
  return await collection.updateOne({ email }, { $set: { lightningAddress } });
}
