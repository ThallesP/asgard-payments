import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

export type CreateAppInput = {
  name: string;
  image: string;
  domain: string;
  namespace: pulumi.Input<string>;
  initCommand?: string[];
  replicas: number;
  variables?: k8s.types.input.core.v1.EnvVar[];
  secretName?: pulumi.Input<string>;
};

export function createApp({
  name,
  replicas,
  initCommand,
  domain,
  image,
  namespace,
  variables = [],
  secretName,
}: CreateAppInput) {
  const envFrom: k8s.types.input.core.v1.EnvFromSource[] = [];

  if (secretName) {
    envFrom.push({
      secretRef: {
        name: secretName,
      },
    });
  }

  const deployment = new k8s.apps.v1.Deployment(name, {
    metadata: {
      name: `${name}-deployment`,
      namespace,
    },
    spec: {
      replicas,
      selector: {
        matchLabels: {
          app: `${name}-pod`,
        },
      },
      template: {
        metadata: {
          labels: {
            app: `${name}-pod`,
          },
        },
        spec: {
          initContainers: initCommand
            ? [
                {
                  name: `${name}-init`,
                  image,
                  command: initCommand,
                },
              ]
            : [],
          containers: [
            {
              image,
              name: `${name}-container`,
              env: variables.length > 0 ? variables : undefined,
              envFrom: envFrom.length > 0 ? envFrom : undefined,
            },
          ],
        },
      },
    },
  });

  const service = new k8s.core.v1.Service(`${name}-service`, {
    metadata: {
      name: `${name}-service`,
      namespace,
    },
    spec: {
      selector: {
        app: `${name}-pod`,
      },
      ports: [
        {
          port: 80,
          targetPort: 3000,
        },
      ],
    },
  });

  const ingress = new k8s.networking.v1.Ingress(`${name}-ingress`, {
    apiVersion: "networking.k8s.io/v1",
    kind: "Ingress",
    metadata: {
      name: `${name}-ingress`,
      namespace,
      annotations: {
        "traefik.ingress.kubernetes.io/router.entrypoints": "web",
      },
    },
    spec: {
      rules: [
        {
          host: domain,
          http: {
            paths: [
              {
                pathType: "Prefix",
                path: "/",
                backend: {
                  service: {
                    name: `${name}-service`,
                    port: {
                      number: 80,
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  });

  return { deployment, ingress, service };
}
