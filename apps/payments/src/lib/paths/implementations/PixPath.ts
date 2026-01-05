import type { Path } from "../Path";

// TODO: Implement PIX path
export class PixPath implements Path {
  async createSource(): Promise<unknown> {
    throw new Error("Not implemented");
  }
}
