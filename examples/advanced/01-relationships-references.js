import { connect, close } from "../../config/db.js";
import { ObjectId } from "mongodb";

async function run() {
  console.log("=== Relationships & DB References ===\n");

  const { db } = await connect();
  const customersColl = db.collection("customers_ref");
  const ordersColl = db.collection("orders_ref");

  await customersColl.deleteMany({});
  await ordersColl.deleteMany({});

  const c1 = await customersColl.insertOne({ name: "Alice", city: "NYC" });
  const c2 = await customersColl.insertOne({ name: "Bob", city: "LA" });
  await ordersColl.insertMany([
    { customerId: c1.insertedId, product: "Laptop", total: 999 },
    { customerId: c1.insertedId, product: "Mouse", total: 29 },
    { customerId: c2.insertedId, product: "Keyboard", total: 79 },
  ]);

  const ordersWithCustomer = await ordersColl
    .aggregate([
      {
        $lookup: {
          from: "customers_ref",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      { $project: { product: 1, total: 1, "customer.name": 1 } },
    ])
    .toArray();
  console.log("Orders with customer (via $lookup):", ordersWithCustomer);

  await close();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
