import { connect, close } from "../../config/db.js";

async function run() {
  console.log("=== Replication & Sharding (concepts) ===\n");

  const { client, db } = await connect();

  try {
    const adminDb = client.db().admin();
    const status = await adminDb.command({ isMaster: 1 }).catch(() => null);
    if (status) {
      console.log(
        "Cluster type:",
        status.msg || (status.setName ? "Replica Set" : "Standalone"),
      );
      if (status.setName) console.log("Replica set name:", status.setName);
      if (status.primary) console.log("Primary:", status.primary);
    }
  } catch (e) {
    console.log("Server info not available (e.g. not a replica set).");
  }

  console.log("\nReplication: Deploy replica set for high availability.");
  console.log(
    "  URI example: mongodb://host1:27017,host2:27017,host3:27017/?replicaSet=rs0",
  );
  console.log(
    "Sharding: Deploy mongos + config servers + shards to distribute data.",
  );
  console.log("  Connect to: mongodb://mongos:27017");
  console.log(
    "\nDeploy to server: use MongoDB Atlas or self-host with replica set/sharding as per docs.",
  );

  await close();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
