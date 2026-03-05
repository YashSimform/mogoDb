import { connect, close } from '../../config/db.js';

async function run() {
  console.log('=== Query Analysis & Covered Queries ===\n');

  const { db } = await connect();
  const coll = db.collection('covered_demo');

  await coll.drop().catch(() => {});
  await coll.insertMany([
    { x: 1, y: 10, z: 'a' },
    { x: 2, y: 20, z: 'b' },
    { x: 3, y: 30, z: 'c' },
  ]);

  const index = await coll.createIndex({ x: 1, y: 1 });
  console.log("Created index:", index);

  const explain = await coll.find({ x: 2 }, { projection: { y: 1, _id: 0 } }).explain('queryPlanner');
  console.log('Explain find({ x: 2 }, { projection: { y: 1, _id: 0 } }):');
  console.log('  stage:', explain.queryPlanner?.winningPlan?.stage);
  console.log('  inputStage:', explain.queryPlanner?.winningPlan?.inputStage?.stage);

  const execStats = await coll.find({ x: 2 }, { projection: { y: 1, _id: 0 } }).explain('executionStats');
  console.log('\nExecution stats:');
  console.log('  totalDocsExamined:', execStats.executionStats?.totalDocsExamined);
  console.log('  totalKeysExamined:', execStats.executionStats?.totalKeysExamined);
  console.log('  executionTimeMillis:', execStats.executionStats?.executionTimeMillis);

  await close();
  console.log('\nDone.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
