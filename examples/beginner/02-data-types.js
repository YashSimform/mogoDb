import { connect, close } from "../../config/db.js";
import { ObjectId } from "mongodb";

async function run() {
  console.log("=== MongoDB Data Types (BSON) ===\n");

  const { db } = await connect();
  const coll = db.collection("data_types_demo");

  await coll.deleteMany({});

  const doc = {
    string: "Hello MongoDB",
    int: 42,
    double: 3.14159,
    bool: true,
    date: new Date(),
    objectId: new ObjectId(),
    null: null,
    array: [1, "two", { nested: true }],
    embeddedDoc: {
      name: "nested",
      value: 100,
    },
    regex: /^hello/i,
  };

  await coll.insertOne(doc);
  console.log("Inserted document with BSON types:");
  console.log(
    "  string, int, long, double, decimal, bool, date, objectId, null, array, embeddedDoc, binary, regex, int32, timestamp",
  );

  const found = await coll.findOne({});
  console.log("\nRead back from DB - keys:", Object.keys(found).join(", "));

  await coll.drop().catch(() => {});
  await close();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
