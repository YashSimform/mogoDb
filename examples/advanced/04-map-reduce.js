import { connect, close } from "../../config/db.js";

async function run() {
  console.log("=== Map Reduce (and equivalent aggregation) ===\n");

  const { db } = await connect();
  const coll = db.collection("sales_mr");

  await coll.drop().catch(() => {});
  await coll.insertMany([
    { product: "A", amount: 100 },
    { product: "A", amount: 150 },
    { product: "B", amount: 80 },
  ]);

  const agg = await coll
    .aggregate([{ $group: { _id: "$product", total: { $sum: "$amount" } } }])
    .toArray();
  console.log("Aggregation (preferred): sum amount by product:", agg);

  if (typeof coll.mapReduce === "function") {
    try {
      const mapFn = function () {
        emit(this.product, this.amount);
      };
      const reduceFn = function (key, values) {
        return Array.sum(values);
      };
      const result = await coll.mapReduce(mapFn, reduceFn, {
        out: { inline: 1 },
      });
      console.log("MapReduce result (legacy):", result);
    } catch (e) {
      console.log(
        "MapReduce not available or failed (use aggregation above):",
        e.message,
      );
    }
  } else {
    console.log(
      "MapReduce not available in this driver; use aggregation above.",
    );
  }

  await coll.drop().catch(() => {});
  await close();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
