import { connect, close } from "../../config/db.js";

async function run() {
  console.log("=== Aggregation ===\n");

  const { db } = await connect();
  const coll = db.collection("orders");

  await coll.deleteMany({});
  await coll.insertMany([
    { product: "A", amount: 100, region: "North" },
    { product: "B", amount: 150, region: "North" },
    { product: "A", amount: 80, region: "South" },
    { product: "C", amount: 200, region: "South" },
  ]);

  const pipeline = [
    { $match: { amount: { $gte: 80 } } },
    {
      $group: {
        _id: "$region",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ];
  const result = await coll.aggregate(pipeline).toArray();
  console.log(
    "Aggregation: $match (amount>=80), $group by region, $sort:",
    result,
  );

  const avgByProduct = await coll
    .aggregate([
      { $group: { _id: "$product", avgAmount: { $avg: "$amount" } } },
      { $sort: { avgAmount: -1 } },
    ])
    .toArray();
  console.log("\nAverage amount by product:", avgByProduct);

  // await coll.drop().catch(() => {});
  await close();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
