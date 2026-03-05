import { connect, close } from "../../config/db.js";

async function run() {
  console.log("=== Projection ===\n");

  const { db } = await connect();
  const coll = db.collection("employees");

  await coll.deleteMany({});
  await coll.insertMany([
    { name: "Alice", dept: "IT", salary: 80000, age: 30 },
    { name: "Bob", dept: "HR", salary: 65000, age: 28 },
    { name: "Carol", dept: "IT", salary: 90000, age: 35 },
  ]);

  const namesOnly = await coll
    .find({}, { projection: { name: 1, dept: 1 } })
    .toArray();
  console.log(
    "Projection { name: 1, dept: 1 } (include name, dept, _id):",
    namesOnly,
  );

  const noSalary = await coll.find({}, { projection: { salary: 0 } }).toArray();
  console.log(
    "\nProjection { salary: 0 } (exclude salary):",
    noSalary.map((d) => ({ ...d, salary: "(excluded)" })),
  );

  const noId = await coll
    .find({}, { projection: { name: 1, dept: 1, _id: 0 } })
    .toArray();
  console.log("\nProjection { name: 1, dept: 1, _id: 0 }:", noId);

  // await coll.drop().catch(() => {});
  await close();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
