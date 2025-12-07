import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

export type CreateDatabaseInput = {
  name: string;
  namespace: pulumi.Output<string>;
  image: string;
  port: number;
  command?: string[];
  volumeMountPath: string;
  initCommand?: string[];
  storageSize?: string;
  env?: { name: string; value: pulumi.Output<string> | string }[];
};

export function createDatabase({
  name,
  image,
  port,
  namespace,
  command,
  volumeMountPath,
  initCommand,
  storageSize = "1Gi",
  env,
}: CreateDatabaseInput) {
  const pvc = new k8s.core.v1.PersistentVolumeClaim(`${name}-pvc`, {
    metadata: {
      name: `${name}-pvc`,
      namespace,
    },
    spec: {
      accessModes: ["ReadWriteOncePod"],
      resources: {
        requests: {
          storage: storageSize,
        },
      },
    },
  });

  const volumeMounts = [
    {
      name: `${name}-volume`,
      mountPath: volumeMountPath,
    },
  ];

  const deployment = new k8s.apps.v1.Deployment(`${name}-deployment`, {
    metadata: {
      name: `${name}-deployment`,
      namespace,
    },
    spec: {
      replicas: 1,
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
                  volumeMounts,
                },
              ]
            : undefined,
          containers: [
            {
              name,
              image,
              ports: [{ containerPort: port }],
              command,
              volumeMounts,
              env,
            },
          ],
          volumes: [
            {
              name: `${name}-volume`,
              persistentVolumeClaim: {
                claimName: pvc.metadata.name,
              },
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
          name: "db",
          port: port,
          targetPort: port,
        },
      ],
    },
  });

  return {
    deployment,
    pvc,
    service,
    connectionString: pulumi.secret(
      pulumi.interpolate`${service.metadata.name}.${namespace}.svc.cluster.local:${port}`,
    ),
  };
}
