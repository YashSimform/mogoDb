#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname);

const levels = {
  beginner: [
    'examples/beginner/01-database-collections.js',
    'examples/beginner/02-data-types.js',
    'examples/beginner/03-schema-design-demo.js',
    'examples/beginner/04-crud-operations.js',
    'examples/beginner/05-user-registration.js',
  ],
  intermediate: [
    'examples/intermediate/01-projection.js',
    'examples/intermediate/02-limit-sort.js',
    'examples/intermediate/03-indexing.js',
    'examples/intermediate/04-aggregation.js',
    'examples/intermediate/05-replication-sharding.js',
    'examples/intermediate/06-backup.js',
  ],
  advanced: [
    'examples/advanced/01-relationships-references.js',
    'examples/advanced/02-atomic-operations.js',
    'examples/advanced/03-query-analysis-covered.js',
    'examples/advanced/04-map-reduce.js',
    'examples/advanced/05-text-search.js',
    'examples/advanced/06-regular-expressions.js',
    'examples/advanced/07-objectid-usage.js',
  ],
};

function run(scriptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [join(root, scriptPath)], {
      stdio: 'inherit',
      cwd: root,
    });
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`Exit ${code}`))));
    child.on('error', reject);
  });
}

async function main() {
  const args = process.argv.slice(2);
  const levelArg = args.indexOf('--level');
  const level = levelArg !== -1 ? args[levelArg + 1] : null;
  const all = args.includes('--all');

  if (all) {
    for (const l of ['beginner', 'intermediate', 'advanced']) {
      console.log('\n========== LEVEL:', l.toUpperCase(), '==========');
      for (const script of levels[l]) {
        await run(script);
      }
    }
    return;
  }

  if (level && levels[level]) {
    for (const script of levels[level]) {
      await run(script);
    }
    return;
  }

  console.log('MongoDB POC - Run examples by level\n');
  console.log('Usage:');
  console.log('  node index.js --level beginner');
  console.log('  node index.js --level intermediate');
  console.log('  node index.js --level advanced');
  console.log('  node index.js --all');
  console.log('\nOr run individual scripts:');
  console.log('  npm run db-setup    npm run crud    npm run projection');
  console.log('  npm run limit-sort  npm run indexing  npm run aggregation');
  console.log('  npm run backup      npm run relationships  npm run atomic');
  console.log('  npm run mapreduce   npm run text-search   npm run regex');
  console.log('  npm run query-analysis  npm run register');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
