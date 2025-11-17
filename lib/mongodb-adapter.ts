// Inspired by https://github.com/nextauthjs/next-auth/blob/main/packages/adapter-mongodb/src/index.ts

import { ObjectId, Collection } from 'mongodb';

import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from 'next-auth/adapters';
import type { DatabaseClient } from './mongodb';

/** This is the interface of the MongoDB adapter options. */
export interface MongoDBAdapterOptions {
  /**
   * The name of the {@link https://www.mongodb.com/docs/manual/core/databases-and-collections/#collections MongoDB collections}.
   */
  collections?: {
    Users?: string;
    Accounts?: string;
    Sessions?: string;
    VerificationTokens?: string;
  };
  /**
   * The name you want to give to the MongoDB database
   */
  databaseName?: string;
}

export const defaultCollections: Required<
  Required<MongoDBAdapterOptions>["collections"]
> = {
  Users: "users",
  Accounts: "accounts",
  Sessions: "sessions",
  VerificationTokens: "verification_tokens",
}

export const format = {
  /** Takes a mongoDB object and returns a plain old JavaScript object */
  from<T = Record<string, unknown>>(object: Record<string, any>): T {
    const newObject: Record<string, unknown> = {};
    for (const key in object) {
      const value = object[key];
      if (key === "_id") {
        newObject.id = value.toHexString();
      } else if (key === "userId") {
        newObject[key] = value.toHexString();
      } else {
        newObject[key] = value;
      }
    }
    return newObject as T;
  },
  /** Takes a plain old JavaScript object and turns it into a mongoDB object */
  to<T = Record<string, unknown>>(object: Record<string, any>) {
    const newObject: Record<string, unknown> = {
      _id: _id(object.id),
    };
    for (const key in object) {
      const value = object[key];
      if (key === "userId") newObject[key] = _id(value);
      else if (key === "id") continue;
      else newObject[key] = value;
    }
    return newObject as T & { _id: ObjectId };
  },
}

/** @internal */
export function _id(hex?: string) {
  if (hex?.length !== 24) return new ObjectId();
  return new ObjectId(hex);
}

interface Db {
  U: Collection<AdapterUser>;
  A: Collection<AdapterAccount>;
  S: Collection<AdapterSession>;
  V: Collection<VerificationToken>;
  close: () => void;
}

export function MongoDBAdapter(
  createClient: () => Promise<DatabaseClient>,
  options: MongoDBAdapterOptions = {}
): Adapter {
  const { collections } = options
  const { from, to } = format

  const createDb = async (): Promise<Db> => {
    const { client, close } = await createClient();
    const _db = client.db(options.databaseName);
    const c = { ...defaultCollections, ...collections };
    return {
      U: _db.collection(c.Users),
      A: _db.collection(c.Accounts),
      S: _db.collection(c.Sessions),
      V: _db.collection(c?.VerificationTokens),
      close,
    };
  };

  return {
    async createUser(data: AdapterUser) {
      const user = to<AdapterUser>(data);
      const db = await createDb();
      try {
        await db.U.insertOne(user);
        return from<AdapterUser>(user);
      } finally {
        db.close();
      }
    },
    async getUser(id: string) {
      const db = await createDb();
      try {
        const user = await db.U.findOne({ _id: _id(id) });
        if (!user) return null;
        return from<AdapterUser>(user);
      } finally {
        db.close();
      }
    },
    async getUserByEmail(email: string) {
      const db = await createDb();
      try {
        const user = await db.U.findOne({ email });
        if (!user) return null;
        return from<AdapterUser>(user);
      } finally {
        db.close();
      }
    },
    async getUserByAccount(provider_providerAccountId: { provider: string; providerAccountId: string }) {
      const db = await createDb();
      try {
        const account = await db.A.findOne(provider_providerAccountId);
        if (!account) return null;
        const user = await db.U.findOne({ _id: new ObjectId(account.userId) });
        if (!user) return null;
        return from<AdapterUser>(user);
      } finally {
        db.close();
      }
    },
    async updateUser(data: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      const { _id, ...user } = to<AdapterUser>(data as AdapterUser);

      const db = await createDb();

      try {
        const result = await db.U.findOneAndUpdate(
          { _id },
          { $set: user },
          { returnDocument: "after" },
        );
        return from<AdapterUser>(result.value!);
      } finally {
        db.close();
      }
    },
    async deleteUser(id: string) {
      const userId = _id(id);
      const m = await createDb();
      try {
        await Promise.all([
          m.A.deleteMany({ userId: userId as any }),
          m.S.deleteMany({ userId: userId as any }),
          m.U.deleteOne({ _id: userId }),
        ]);
      } finally {
        m.close();
      }
    },
    linkAccount: async (data: AdapterAccount) => {
      const account = to<AdapterAccount>(data);
      const db = await createDb();
      try {
        await db.A.insertOne(account);
        return account;
      } finally {
        db.close();
      }
    },
    async unlinkAccount(provider_providerAccountId: { provider: string; providerAccountId: string }) {
      const db = await createDb();
      try {
        const { value: account } = await db.A.findOneAndDelete(provider_providerAccountId);
        return from<AdapterAccount>(account!);
      } finally {
        db.close();
      }
    },
    async getSessionAndUser(sessionToken: string) {
      const db = await createDb();
      try {
        const session = await db.S.findOne({ sessionToken });
        if (!session) return null;
        const user = await db.U.findOne({ _id: new ObjectId(session.userId) });
        if (!user) return null;
        return {
          user: from<AdapterUser>(user),
          session: from<AdapterSession>(session),
        };
      } catch (error) {
        console.error('MongoDB adapter getSessionAndUser error:', error);
        return null;
      } finally {
        db.close();
      }
    },
    async createSession(data: AdapterSession) {
      const session = to<AdapterSession>(data);
      const db = await createDb();
      try {
        await db.S.insertOne(session);
        return from<AdapterSession>(session);
      } finally {
        db.close();
      }
    },
    async updateSession(data: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">) {
      const { _id, ...session } = to<AdapterSession>(data as AdapterSession);
      const db = await createDb();
      try {
        const result = await db.S.findOneAndUpdate(
          { sessionToken: session.sessionToken },
          { $set: session },
          { returnDocument: "after" },
        );
        return from<AdapterSession>(result.value!);
      } finally {
        db.close();
      }
    },
    async deleteSession(sessionToken: string) {
      const db = await createDb();
      try {
        const { value: session } = await db.S.findOneAndDelete({
          sessionToken,
        });
        return from<AdapterSession>(session!);
      } finally {
        db.close();
      }
    },
    async createVerificationToken(data: VerificationToken) {
      const db = await createDb();
      try {
        await db.V.insertOne(to(data));
        return data;
      } finally {
        db.close();
      }
    },
    async useVerificationToken(identifier_token: { identifier: string; token: string }) {
      const db = await createDb();
      try {
        const { value: verificationToken } = await db.V.findOneAndDelete(identifier_token);

        if (!verificationToken) return null;
        // @ts-expect-error
        delete verificationToken._id;
        return verificationToken;
      } finally {
        db.close();
      }
    },
  };
}
