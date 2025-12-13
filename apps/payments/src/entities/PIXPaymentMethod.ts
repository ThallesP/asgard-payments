import { PaymentMethod, type PaymentMethodProps } from "./PaymentMethod";
import type { PixKey } from "./valueObjects/PixKey";

export type PIXPaymentMethodProps = PaymentMethodProps & {
  key: PixKey;
};

export class PIXPaymentMethod extends PaymentMethod {
  constructor(private pixProps: PIXPaymentMethodProps) {
    super(pixProps);
  }

  public get key(): PixKey {
    return this.pixProps.key;
  }
}
