import * as k8s from "@pulumi/kubernetes";
import { createApp } from "./shared";

const provider = new k8s.Provider("k8s");

const asgardNamespace = new k8s.core.v1.Namespace("asgard");

const payments = createApp({
  namespace: asgardNamespace.metadata.name.get(),
  replicas: 3,
  image: "",
  name: "deployments",
  domain: "",
});
