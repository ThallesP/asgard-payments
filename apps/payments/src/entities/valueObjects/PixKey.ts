import z from "zod";
import { err, ok } from "neverthrow";
import { Exception } from "../../../core/Exception";

export enum PixKeyType {
  CPF = "CPF",
  CNPJ = "CNPJ",
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  RANDOM = "RANDOM",
}

const VALIDATORS: Record<PixKeyType, (value: string) => boolean> = {
  // i did that code, probably why its bad
  CPF: (value: string) => {
    if (value.length !== 11 || !value.match(/(\d.*-){1}\d\d/)) return false;

    const cpfDigits = value.replaceAll(".", "").replaceAll("-", "");
    const cpfBaseDigits = cpfDigits.slice(0, 9);

    let firstVerifierSum = 0;
    let digitIndex = 0;
    for (let weight = 10; weight >= 2; weight--) {
      firstVerifierSum += weight * Number(cpfBaseDigits[digitIndex]);
      digitIndex++;
    }

    const firstRemainder = firstVerifierSum % 11;
    const expectedFirstVerifierDigit =
      firstRemainder < 2 ? 0 : 11 - firstRemainder;

    const cpfWithFirstVerifier = cpfDigits;

    let secondVerifierSum = 0;
    let secondDigitIndex = 0;
    for (let weight = 11; weight >= 2; weight--) {
      secondVerifierSum +=
        weight * Number(cpfWithFirstVerifier[secondDigitIndex]);
      secondDigitIndex++;
    }

    const secondRemainder = secondVerifierSum % 11;
    const expectedSecondVerifierDigit =
      secondRemainder < 2 ? 0 : 11 - secondRemainder;

    const actualFirstVerifierDigit = Number(cpfDigits[9]);
    const actualSecondVerifierDigit = Number(cpfDigits[10]);

    if (
      expectedFirstVerifierDigit === actualFirstVerifierDigit &&
      expectedSecondVerifierDigit === actualSecondVerifierDigit
    )
      return true;

    return false;
  },
  // same for this
  CNPJ: (value: string) => {
    if (value.length !== 14 || !value.match(/(\d.*-){1}\d\d/)) return false;

    const cnpjDigits = value.replaceAll(".", "").replaceAll("-", "");
    const cnpjBaseDigits = cnpjDigits.slice(0, 12);

    let firstVerifierSum = 0;
    let digitIndex = 0;
    for (let weight = 5; weight >= 2; weight--) {
      firstVerifierSum += weight * Number(cnpjBaseDigits[digitIndex]);
      digitIndex++;
    }

    const firstRemainder = firstVerifierSum % 11;
    const expectedFirstVerifierDigit =
      firstRemainder < 2 ? 0 : 11 - firstRemainder;

    const cnpjWithFirstVerifier = cnpjDigits;

    let secondVerifierSum = 0;
    let secondDigitIndex = 0;
    for (let weight = 6; weight >= 2; weight--) {
      secondVerifierSum +=
        weight * Number(cnpjWithFirstVerifier[secondDigitIndex]);
      secondDigitIndex++;
    }

    const secondRemainder = secondVerifierSum % 11;
    const expectedSecondVerifierDigit =
      secondRemainder < 2 ? 0 : 11 - secondRemainder;

    const actualFirstVerifierDigit = Number(cnpjDigits[12]);
    const actualSecondVerifierDigit = Number(cnpjDigits[13]);

    if (
      expectedFirstVerifierDigit === actualFirstVerifierDigit &&
      expectedSecondVerifierDigit === actualSecondVerifierDigit
    )
      return true;

    return false;
  },
  EMAIL: (value: string) => {
    return z.email().safeParse(value).success;
  },
  PHONE: (value: string) => {
    if (value.length < 10 || value.length > 15) return false;
    return z.string().min(10).max(15).safeParse(value).success;
  },
  RANDOM: (value: string) => {
    return z.uuid().safeParse(value).success;
  },
};

export class PixKey {
  constructor(
    public value: string,
    public type: string,
  ) {}

  public static create(value: string, type: PixKeyType) {
    if (!VALIDATORS[type](value))
      return err(
        new Exception(
          "Pix Key is not a valid format. Please check and try again.",
          "INVALID_VALUE",
          400,
        ),
      );

    return ok(new PixKey(value, type));
  }
}
