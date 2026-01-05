import type { Path } from "./Path";
import { PixPath } from "./implementations/PixPath";

export class PathFactory {
  private static instance: PathFactory;
  private paths: Map<string, Path> = new Map();

  private constructor() {}

  static getInstance(): PathFactory {
    if (!PathFactory.instance) {
      PathFactory.instance = new PathFactory();
    }
    return PathFactory.instance;
  }

  get(type: "PIX"): Path {
    if (this.paths.has(type)) {
      return this.paths.get(type) as Path;
    }

    let path: Path;
    switch (type) {
      case "PIX":
        path = new PixPath();
        break;
      default:
        throw new Error(`Unknown path type: ${type}`);
    }

    this.paths.set(type, path);
    return path;
  }
}
