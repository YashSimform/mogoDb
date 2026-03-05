import { connect, close } from '../../config/db.js';

async function run() {
  console.log('=== Text Search ===\n');

  const { db } = await connect();
  const coll = db.collection('articles');

  await coll.drop().catch(() => {});
  await coll.insertMany([
    { title: 'MongoDB tutorial', body: 'Learn MongoDB basics and CRUD' },
    { title: 'Node.js guide', body: 'Node.js and MongoDB integration' },
    { title: 'Database design', body: 'MongoDB schema design best practices' },
  ]);

  await coll.createIndex({ title: 'text', body: 'text' });
  console.log('Created text index on title and body.');

  const results = await coll.find({ $text: { $search: 'MongoDB' } }).toArray();
  console.log('$text search for "MongoDB":', results.map((d) => d.title));

  const scoreResults = await coll
    .find({ $text: { $search: 'MongoDB tutorial' } }, { projection: { score: { $meta: 'textScore' } } })
    .sort({ score: { $meta: 'textScore' } })
    .toArray();
  console.log('\nWith text score:', scoreResults.map((d) => ({ title: d.title, score: d.score })));

  await close();
  console.log('\nDone.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
