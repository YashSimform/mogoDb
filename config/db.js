import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB_NAME || 'mongodb_poc';

let client = null;
let db = null;

export async function connect() {
  if (client) return { client, db };
  client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  db = client.db(dbName);
  return { client, db };
}

export function getDb() {
  return db;
}

export async function close() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

export { uri, dbName };
