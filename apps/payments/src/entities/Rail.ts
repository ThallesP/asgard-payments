export type RailProps = {
  id: string;
};

export class Rail {
  constructor(private props: RailProps) {}

  public get source(): string {
    return this.props.id;
  }
}
