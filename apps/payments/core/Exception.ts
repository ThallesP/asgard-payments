export class Exception extends Error {
  constructor(
    public message: string,
    public code: string,
    public status: number,
    public extra?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
