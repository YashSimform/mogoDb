import { connect, close } from "../../config/db.js";

async function run() {
  console.log("=== Limit and Sort ===\n");

  const { db } = await connect();
  const coll = db.collection("scores");

  await coll.deleteMany({});
  await coll.insertMany([
    { player: "A", score: 90, level: 2 },
    { player: "B", score: 85, level: 3 },
    { player: "C", score: 95, level: 1 },
    { player: "D", score: 80, level: 2 },
    { player: "E", score: 88, level: 1 },
  ]);

  const sortByScoreDesc = await coll.find({}).sort({ score: -1 }).toArray();
  console.log(
    "Sort by score descending:",
    sortByScoreDesc.map((d) => d.player + ":" + d.score),
  );

  const topTwo = await coll.find({}).sort({ score: -1 }).limit(2).toArray();
  console.log(
    "\nTop 2 by score:",
    topTwo.map((d) => d.player),
  );

  const skipOneTakeTwo = await coll
    .find({})
    .sort({ score: -1 })
    .skip(1)
    .limit(2)
    .toArray();
  console.log(
    "Skip 1, limit 2 (2nd and 3rd):",
    skipOneTakeTwo.map((d) => d.player),
  );

  const sortMultiple = await coll
    .find({})
    .sort({ level: 1, score: -1 })
    .toArray();
  console.log(
    "\nSort by level asc, then score desc:",
    sortMultiple.map((d) => `${d.player}(L${d.level},S${d.score})`),
  );

  // await coll.drop().catch(() => {});
  await close();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
