import { connect, close } from "../../config/db.js";
import { ObjectId } from "mongodb";

async function run() {
  console.log("=== CRUD Operations & Optimized Queries ===\n");

  const { db } = await connect();
  const coll = db.collection("products");

  await coll.deleteMany({});

  const insertOneResult = await coll.insertOne({
    name: "Laptop",
    price: 999,
    category: "electronics",
    inStock: true,
  });
  console.log("Insert One - insertedId:", insertOneResult.insertedId);

  const insertManyResult = await coll.insertMany([
    { name: "Phone", price: 599, category: "electronics", inStock: true },
    { name: "Desk", price: 299, category: "furniture", inStock: true },
    { name: "Chair", price: 149, category: "furniture", inStock: false },
    { name: "Monitor", price: 349, category: "electronics", inStock: true },
  ]);
  console.log("Insert Many - count:", insertManyResult.insertedCount);

  const all = await coll.find({}).toArray();
  console.log("\nFind all - count:", all.length);

  const electronics = await coll.find({ category: "electronics" }).toArray();
  console.log("Find category=electronics:", electronics.length);

  const inStock = await coll.findOne({ inStock: true });
  console.log("Find one inStock:", inStock?.name);

  const byId = await coll.findOne({ _id: insertOneResult.insertedId });
  console.log("Find by _id:", byId?.name);

  const updateResult = await coll.updateOne(
    { name: "Laptop" },
    { $set: { price: 949, updatedAt: new Date() } },
  );
  console.log("\nUpdate One - modifiedCount:", updateResult.modifiedCount);

  const updateManyResult = await coll.updateMany(
    { category: "electronics" },
    { $inc: { price: 10 } },
  );
  console.log(
    "Update Many ($inc price by 10) - modifiedCount:",
    updateManyResult.modifiedCount,
  );

  const deleteResult = await coll.deleteOne({ name: "Chair" });
  console.log("\nDelete One - deletedCount:", deleteResult.deletedCount);

  const remaining = await coll.find({}).toArray();
  console.log("Remaining documents:", remaining.length);

  const optimized = await coll
    .find({ category: "electronics" }, { projection: { name: 1, price: 1 } })
    .sort({ price: 1 })
    .limit(5)
    .toArray();
  console.log("\nOptimized query (projection + sort + limit):", optimized);

  await close();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
