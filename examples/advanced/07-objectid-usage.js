import { connect, close } from "../../config/db.js";
import { ObjectId } from "mongodb";

async function run() {
  console.log("=== ObjectId Usage ===\n");

  const { db } = await connect();
  const coll = db.collection("objectid_demo");

  await coll.deleteMany({});
  const id = new ObjectId();
  await coll.insertOne({ _id: id, name: "Doc1" });

  console.log("Generated ObjectId:", id.toString());
  console.log("ObjectId timestamp (date):", id.getTimestamp());

  const byId = await coll.findOne({ _id: new ObjectId(id.toString()) });
  console.log("Find by string Id (converted to ObjectId):", byId?.name);

  const isValid = ObjectId.isValid("507f1f77bcf86cd799439011");
  console.log('\nObjectId.isValid("507f1f77bcf86cd799439011"):', isValid);
  console.log('ObjectId.isValid("invalid"):', ObjectId.isValid("invalid"));

  // await coll.drop().catch(() => {});
  await close();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
