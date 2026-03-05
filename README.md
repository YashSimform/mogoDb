# MongoDB POC – Full Feature Guide

A single Proof of Concept that demonstrates **all** MongoDB features from **Beginner** to **Advanced**, so you can understand and run every concept in code.

## Features Covered

### Beginner
- **Fundamentals**: What is MongoDB, why/where to use it, pros and cons, SQL vs NoSQL → see [`docs/01-mongodb-fundamentals.md`](docs/01-mongodb-fundamentals.md)
- **Environment setup**: Connection string, `.env`, running examples → [`docs/02-environment-setup.md`](docs/02-environment-setup.md)
- **Data modeling & schema**: Embedding vs references → [`docs/03-data-modeling-schema.md`](docs/03-data-modeling-schema.md) and [`examples/beginner/03-schema-design-demo.js`](examples/beginner/03-schema-design-demo.js)
- **Create/drop databases and collections** → [`examples/beginner/01-database-collections.js`](examples/beginner/01-database-collections.js)
- **Data types (BSON)** → [`examples/beginner/02-data-types.js`](examples/beginner/02-data-types.js)
- **CRUD and simple optimized queries** → [`examples/beginner/04-crud-operations.js`](examples/beginner/04-crud-operations.js)

### Intermediate
- **Projection** → [`examples/intermediate/01-projection.js`](examples/intermediate/01-projection.js)
- **Limit and sort** → [`examples/intermediate/02-limit-sort.js`](examples/intermediate/02-limit-sort.js)
- **Indexing** → [`examples/intermediate/03-indexing.js`](examples/intermediate/03-indexing.js)
- **Aggregation** → [`examples/intermediate/04-aggregation.js`](examples/intermediate/04-aggregation.js)
- **Replication and sharding** (concepts + connection) → [`examples/intermediate/05-replication-sharding.js`](examples/intermediate/05-replication-sharding.js)
- **Backup** (export + mongodump/mongorestore) → [`examples/intermediate/06-backup.js`](examples/intermediate/06-backup.js)

### Advanced
- **Relationships and DB references** (`$lookup`) → [`examples/advanced/01-relationships-references.js`](examples/advanced/01-relationships-references.js)
- **Covered queries and query analysis** (explain) → [`examples/advanced/03-query-analysis-covered.js`](examples/advanced/03-query-analysis-covered.js)
- **Atomic operations** (single-doc + multi-doc transactions) → [`examples/advanced/02-atomic-operations.js`](examples/advanced/02-atomic-operations.js)
- **Advanced indexing** → [`docs/05-advanced-indexing.md`](docs/05-advanced-indexing.md)
- **ObjectId** → [`examples/advanced/07-objectid-usage.js`](examples/advanced/07-objectid-usage.js)
- **Map Reduce** → [`examples/advanced/04-map-reduce.js`](examples/advanced/04-map-reduce.js)
- **Text search** → [`examples/advanced/05-text-search.js`](examples/advanced/05-text-search.js)
- **Regular expressions** → [`examples/advanced/06-regular-expressions.js`](examples/advanced/06-regular-expressions.js)
- **Rock Mongo / GUI tools** (Compass, Atlas) → [`docs/04-rock-mongo-alternatives.md`](docs/04-rock-mongo-alternatives.md)

## Quick Start

```bash
npm install
cp .env.example .env
# Edit .env: set MONGODB_URI (e.g. mongodb://localhost:27017) and MONGODB_DB_NAME
```

## Run Examples

| Command | Description |
|--------|-------------|
| `npm start` | Show usage and available commands |
| `npm run beginner` | Run all beginner examples |
| `npm run intermediate` | Run all intermediate examples |
| `npm run advanced` | Run all advanced examples |
| `npm run all` | Run every example in order |
| `npm run db-setup` | Create/drop DB and collection |
| `npm run crud` | CRUD operations |
| `npm run projection` | Projection demo |
| `npm run limit-sort` | Limit and sort |
| `npm run indexing` | Indexing demo |
| `npm run aggregation` | Aggregation pipeline |
| `npm run backup` | Backup (export) demo |
| `npm run relationships` | References and `$lookup` |
| `npm run atomic` | Atomic ops and transactions |
| `npm run query-analysis` | Explain and covered queries |
| `npm run mapreduce` | Map Reduce |
| `npm run text-search` | Text index and `$text` |
| `npm run regex` | Regular expression queries |

Or run by level:

```bash
node index.js --level beginner
node index.js --level intermediate
node index.js --level advanced
node index.js --all
```

## Requirements

- **Node.js** 18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

All examples use the same config: `config/db.js` and `.env` (`MONGODB_URI`, `MONGODB_DB_NAME`).
