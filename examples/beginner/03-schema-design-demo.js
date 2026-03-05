import { connect, close } from "../../config/db.js";

async function run() {
  console.log("=== Schema Design Demo ===\n");

  const { db } = await connect();

  const usersColl = db.collection("users_embed_demo");
  await usersColl.deleteMany({});
  await usersColl.insertOne({
    name: "Alice",
    email: "alice@example.com",
    addresses: [
      { type: "home", city: "NYC", zip: "10001" },
      { type: "work", city: "Boston", zip: "02101" },
    ],
  });
  console.log(
    "Embedded: user with addresses - one document holds all related data.",
  );

  const authorsColl = db.collection("authors_ref");
  const booksColl = db.collection("books_ref");
  await authorsColl.deleteMany({});
  await booksColl.deleteMany({});
  const authorRes = await authorsColl.insertOne({
    name: "John Doe",
    country: "USA",
  });
  const authorId = authorRes.insertedId;
  await booksColl.insertMany([
    { title: "Book A", authorId },
    { title: "Book B", authorId },
  ]);
  console.log(
    "Referenced: authors and books in separate collections (authorId reference).",
  );

  const userDoc = await usersColl.findOne({});
  const books = await booksColl.find({ authorId }).toArray();
  console.log(
    "\nUser with embedded addresses:",
    userDoc?.addresses?.length,
    "addresses",
  );
  console.log("Books by author:", books.length);

  // await usersColl.drop().catch(() => {});
  // await authorsColl.drop().catch(() => {});
  // await booksColl.drop().catch(() => {});
  await close();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
