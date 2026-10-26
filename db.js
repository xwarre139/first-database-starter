// db.js: connects to MongoDB. You do not need to change this file today.
// It tries 3 places, in order:
//   1. MONGODB_URI, if it is set (later: MongoDB Atlas, a database in the cloud)
//   2. MongoDB installed on this computer (mongodb://127.0.0.1:27017)
//   3. A practice MongoDB server (needs npm run get-mongodb first)
import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

const LOCAL = "mongodb://127.0.0.1:27017";
let practice = null;
let client = new MongoClient('mongodb+srv://xanderlagamer_db_user:hADjffdiDfPOhOVn@cluster0.anp6pas.mongodb.net/');

async function tryLocal() {
  const local = new MongoClient(LOCAL, { serverSelectionTimeoutMS: 1500 });
  try {
    await local.connect();
    return local;
  } catch {
    await local.close();
    return null;``
  }
}

export async function connect() {
  if (process.env.MONGODB_URI) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log("Connected to MongoDB (MONGODB_URI)");
    return client;
  }

  client = await tryLocal();
  if (client) {
    // Start every run with a clean inventoryDB, so your output matches the slides
    await client.db("inventoryDB").dropDatabase();
    console.log("Connected to MongoDB on this computer");
    return client;
  }

  practice = await MongoMemoryServer.create();
  client = new MongoClient(practice.getUri());
  await client.connect();
  console.log("Connected to a practice MongoDB server");
  return client;
}

export async function disconnect() {
  if (client) await client.close();
  if (practice) await practice.stop();
  console.log("Disconnected");
}
