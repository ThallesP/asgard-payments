import k8s from "@pulumi/kubernetes";

export type CreateAppInput = {
  name: string;
  image: string;
  domain: string;
  namespace: string;
  replicas: number;
};

export function createApp({
  name,
  replicas,
  domain,
  image,
  namespace,
}: CreateAppInput) {
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
          containers: [
            {
              image,
              name: `${name}-container`,
            },
          ],
        },
      },
    },
  });

  const ingress = new k8s.networking.v1.Ingress(`${name}-ingress`, {
    metadata: {
      name: `${name}-ingress`,
      namespace,
    },
    spec: {
      rules: [
        {
          host: domain,
          http: {
            paths: [
              {
                path: "/",
                pathType: "Prefix",
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

  return { deployment, ingress };
}
