import { connect, close } from "../../config/db.js";

async function run() {
  console.log("=== Atomic Operations ===\n");

  const { client, db } = await connect();
  const coll = db.collection("counters");
  const inventory = db.collection("inventory_atomic");

  await coll.deleteMany({});
  await inventory.deleteMany({});

  await coll.insertOne({ _id: "page_views", value: 0 });
  await inventory.insertOne({ sku: "ITEM1", qty: 100 });

  const r = await coll.findOneAndUpdate(
    { _id: "page_views" },
    { $inc: { value: 1 } },
    { returnDocument: "after" },
  );
  console.log("Atomic $inc - counter after +1:", r.value);

  await coll.updateOne({ _id: "page_views" }, { $inc: { value: 5 } });
  const after = await coll.findOne({ _id: "page_views" });
  console.log("After +5:", after.value);

  const invResult = await inventory.findOneAndUpdate(
    { sku: "ITEM1", qty: { $gte: 10 } },
    { $inc: { qty: -10 } },
    { returnDocument: "after" },
  );
  console.log(
    "\nAtomic inventory decrement (10 units): new qty =",
    invResult?.qty,
  );

  let supportsTransactions = false;
  try {
    const res = await client.db().admin().command({ isMaster: 1 });
    supportsTransactions = !!(res.setName || res.msg === "isdbgrid");
  } catch (_) {}

  if (supportsTransactions) {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        await inventory.updateOne(
          { sku: "ITEM1" },
          { $inc: { qty: -5 } },
          { session },
        );
        await coll.updateOne(
          { _id: "page_views" },
          { $inc: { value: 1 } },
          { session },
        );
      });
      console.log("Multi-doc transaction completed.");
    } finally {
      await session.endSession();
    }
  } else {
    console.log(
      "Multi-doc transaction skipped (requires replica set or mongos). Single-doc atomics above work on standalone.",
    );
  }

  const finalInv = await inventory.findOne({ sku: "ITEM1" });
  console.log("Final inventory qty:", finalInv.qty);

  await close();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
