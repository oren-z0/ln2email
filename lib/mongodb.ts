import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string; // your mongodb connection string
const options = {
  maxPoolSize: 10,
  maxIdleTimeMS: 60_000,
};

interface DatabaseClient {
  client: any;
  persist: boolean;
}

let createClient: () => Promise<DatabaseClient>;

declare global {
  var _mongoClientPromise: Promise<any>;
}

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  const globalMongoClientPromise = global._mongoClientPromise;
  createClient = async () => ({
    client: await globalMongoClientPromise,
    persist: true,
  });
} else {
  // In production mode, create a new client each time.
  createClient = async () => {
    const client = new MongoClient(uri, options);
    return {
      client: await client.connect(),
      persist: false,
    };
  };
}

export default createClient;
