import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import * as random from "@pulumi/random";
import { createApp } from "./app";
import { createDatabase } from "./database";

const config = new pulumi.Config();
const imageTag = config.require("imageTag");

const provider = new k8s.Provider("k8s");

const asgardNamespace = new k8s.core.v1.Namespace("asgard");

const tigerbeetleDataPath = "/data/0_0.tigerbeetle";
const tigerbeetlePort = 3000;

const { connectionString } = createDatabase({
  name: "asgard-tigerbeetle-db",
  image: "ghcr.io/tigerbeetle/tigerbeetle",
  namespace: asgardNamespace.metadata.name,
  port: tigerbeetlePort,
  storageSize: "1Gi",
  command: [
    "/tigerbeetle",
    "start",
    `--addresses=0.0.0.0:${tigerbeetlePort}`,
    tigerbeetleDataPath,
  ],
  volumeMountPath: "/data",
  initCommand: [
    "/bin/sh",
    "-c",
    `if [ ! -f ${tigerbeetleDataPath} ]; then /tigerbeetle format --cluster=0 --replica=0 --replica-count=1 ${tigerbeetleDataPath}; fi`,
  ],
});

// i'll be using planetscale as I wanted to give it a test for awhile now.
// const postgresPassword = new random.RandomPassword(
//   "asgard-postgresql-db-password",
//   {
//     length: 32,
//   },
// );

// const { connectionString: postgresConnectionString } = createDatabase({
//   name: "asgard-postgresql-db",
//   image: "postgres:16-alpine",
//   namespace: asgardNamespace.metadata.name,
//   port: 5432,
//   storageSize: "1Gi",
//   volumeMountPath: "/var/lib/postgresql/data",
//   env: [
//     { name: "POSTGRES_USER", value: "asgard" },
//     {
//       name: "POSTGRES_PASSWORD",
//       value: postgresPassword.result,
//     },
//     { name: "POSTGRES_DB", value: "payments" },
//     { name: "PGDATA", value: "/var/lib/postgresql/data/pgdata" },
//   ],
// });
//

const paymentsSecrets = new k8s.core.v1.Secret("asgard-payments-secrets", {
  metadata: {
    name: "asgard-payments-secrets",
    namespace: asgardNamespace.metadata.name,
  },
  type: "Opaque",
  stringData: {
    LEDGER_DATABASE_URL: connectionString,
    DATABASE_URL: config.requireSecret("DATABASE_URL"),
  },
});

const payments = createApp({
  namespace: asgardNamespace.metadata.name,
  replicas: 3,
  image: `ghcr.io/thallesp/asgard-payments:${imageTag}`,
  name: "asgard-payments",
  domain: "payments-asgard.thalles.me",
  secretName: paymentsSecrets.metadata.name,
});
