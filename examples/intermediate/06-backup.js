import { connect, close } from "../../config/db.js";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

async function run() {
  console.log("=== Backup (export demo) ===\n");

  const { db } = await connect();
  const dbName = db.databaseName;
  const backupDir = join(process.cwd(), "backup_output");
  mkdirSync(backupDir, { recursive: true });

  const coll = db.collection("backup_demo");
  await coll.deleteMany({});
  await coll.insertMany([
    { name: "Doc1", value: 1 },
    { name: "Doc2", value: 2 },
  ]);

  const docs = await coll.find({}).toArray();
  const filePath = join(backupDir, `${dbName}_backup_demo_${Date.now()}.json`);
  writeFileSync(filePath, JSON.stringify(docs, null, 2), "utf8");
  console.log("Exported collection to:", filePath);

  console.log(
    '\nFor full database backup use: mongodump --uri="<MONGODB_URI>" --out=./dump',
  );
  console.log('Restore with: mongorestore --uri="<MONGODB_URI>" ./dump');

  await close();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
