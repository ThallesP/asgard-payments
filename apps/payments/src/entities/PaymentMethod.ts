export type PaymentMethodProps = {
  id: string;
  name: string;
};

export abstract class PaymentMethod {
  constructor(private props: PaymentMethodProps) {}

  public get id(): string {
    return this.props.id;
  }

  public get name(): string {
    return this.props.name;
  }
}
