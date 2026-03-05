import { connect, close } from "../../config/db.js";

async function run() {
  console.log("=== Regular Expressions ===\n");

  const { db } = await connect();
  const coll = db.collection("users_regex");

  await coll.deleteMany({});
  await coll.insertMany([
    { name: "Alice", email: "alice@example.com" },
    { name: "Bob", email: "bob@test.org" },
    { name: "Carol", email: "carol@example.com" },
  ]);

  const startsWithA = await coll.find({ name: /^A/ }).toArray();
  console.log(
    "Name starts with A:",
    startsWithA.map((d) => d.name),
  );

  const exampleCom = await coll.find({ email: /@example\.com$/ }).toArray();
  console.log(
    "Email ends with @example.com:",
    exampleCom.map((d) => d.email),
  );

  const caseInsensitive = await coll.find({ name: /bob/i }).toArray();
  console.log(
    'Name contains "bob" (case insensitive):',
    caseInsensitive.map((d) => d.name),
  );

  const regexObj = new RegExp("^carol", "i");
  const carol = await coll.find({ name: regexObj }).toArray();
  console.log(
    'Name starts with "carol" (regex object):',
    carol.map((d) => d.name),
  );

  // await coll.drop().catch(() => {});
  await close();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
