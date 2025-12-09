import type { Pair } from "./Pair";

export type GatewayProps = {
  id: string;
};

export class Gateway {
  constructor(private props: GatewayProps) {}

  get id(): string {
    return this.props.id;
  }
}
