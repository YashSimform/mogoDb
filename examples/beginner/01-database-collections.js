import { connect, close } from "../../config/db.js";

async function run() {
  console.log("=== Create and Drop Databases & Collections ===\n");

  const { client, db } = await connect();
  const dbName = db.databaseName;

  const adminDb = client.db().admin();
  const { databases } = await adminDb.listDatabases();
  console.log("Existing databases:", databases.map((d) => d.name).join(", "));

  const collName = "demo_collection";
  const collections = await db.listCollections().toArray();
  const exists = collections.some((c) => c.name === collName);

  if (!exists) {
    await db.createCollection(collName);
    console.log(`\nCreated collection: ${collName}`);
  } else {
    console.log(`\nCollection already exists: ${collName}`);
  }

  const coll = db.collection(collName);
  await coll.insertOne({ demo: true, createdAt: new Date() });
  console.log("Inserted one document into", collName);

  const listAfter = await db.listCollections().toArray();
  console.log(
    "\nCollections in",
    dbName,
    ":",
    listAfter.map((c) => c.name).join(", "),
  );

  // --- Drop collection (optional - uncomment to test drop) ---
  // await db.collection(collName).drop();
  // console.log('Dropped collection:', collName);

  // --- Drop database (optional - use with caution; uncomment to test) ---
  // await client.db(dbName).dropDatabase();
  // console.log('Dropped database:', dbName);

  await close();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
