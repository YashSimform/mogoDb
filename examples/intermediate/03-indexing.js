import { connect, close } from "../../config/db.js";

async function run() {
  console.log("=== Indexing ===\n");

  const { db } = await connect();
  const coll = db.collection("users_index_demo");

  await coll.drop().catch(() => {});
  await coll.insertMany([
    {
      username: "alice",
      email: "alice@example.com",
      age: 30,
      createdAt: new Date(),
    },
    {
      username: "bob",
      email: "bob@example.com",
      age: 25,
      createdAt: new Date(),
    },
    {
      username: "carol",
      email: "carol@example.com",
      age: 35,
      createdAt: new Date(),
    },
  ]);

  await coll.createIndex({ username: 1 }, { unique: true });
  console.log("Created unique index on username");

  await coll.createIndex({ email: 1 });
  console.log("Created index on email");

  await coll.createIndex({ age: 1, createdAt: -1 });
  console.log("Created compound index { age: 1, createdAt: -1 }");

  const indexes = await coll.indexes();
  console.log(
    "\nIndexes on collection:",
    indexes.map((i) => i.name),
  );

  const explain = await coll
    .find({ username: "alice" })
    .explain("queryPlanner");
  console.log(
    '\nExplain find({ username: "alice" }): winning plan stage:',
    explain.queryPlanner?.winningPlan?.stage,
  );

  // await coll.drop().catch(() => {});
  await close();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
