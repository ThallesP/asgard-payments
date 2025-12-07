import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import { createApp } from "./shared";

const config = new pulumi.Config();
const imageTag = config.require("imageTag");

const provider = new k8s.Provider("k8s");

const asgardNamespace = new k8s.core.v1.Namespace("asgard");

const payments = createApp({
  namespace: asgardNamespace.metadata.name,
  replicas: 3,
  image: `ghcr.io/thallesp/asgard-payments:${imageTag}`,
  name: "asgard-payments",
  domain: "payments-asgard.thalles.me",
});
