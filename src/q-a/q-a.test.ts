import { overlap } from "./q-a";

describe("overlap", () => {
  it("should return true when ranges overlap", () => {
    expect(overlap(1, 5, 4, 6)).toBe(true);
    expect(overlap(7, 10, 8, 12)).toBe(true);
  });

  it("should return false when ranges do not overlap", () => {
    expect(overlap(1, 3, 4, 6)).toBe(false);
    expect(overlap(7, 8, 9, 10)).toBe(false);
  });

  it("should return true when ranges are the same", () => {
    expect(overlap(1, 5, 1, 5)).toBe(true);
  });

  it("should return true when one range is within another", () => {
    expect(overlap(1, 10, 5, 6)).toBe(true);
  });

  // throw an error if input is invalid
  it("should throw an error when x1 is greater than x2", () => {
    expect(() => overlap(5, 1, 4, 6)).toThrow();
  });

  it("should throw an error when x3 is greater than x4", () => {
    expect(() => overlap(1, 5, 6, 4)).toThrow();
  });

  // throw an error if inputs are not numbers
  it("should throw an error when x1 is not a number", () => {
    expect(() => overlap("1" as any, 5, 4, 6)).toThrow();
  });

  it("should throw an error when x2 is not a number", () => {
    expect(() => overlap(1, "5" as any, 4, 6)).toThrow();
  });

  it("should throw an error when x3 is not a number", () => {
    expect(() => overlap(1, 5, "4" as any, 6)).toThrow();
  });

  it("should throw an error when x4 is not a number", () => {
    expect(() => overlap(1, 5, 4, "6" as any)).toThrow();
  });

  // throw an error if NaN is used as an input
  it("should throw an error when x1 is NaN", () => {
    expect(() => overlap(NaN, 5, 4, 6)).toThrow();
  });

  // allow infinity as an input
  it("should return true when x1 is negative infinity", () => {
    expect(overlap(-Infinity, 5, 4, 6)).toBe(true);
  });

  it("should return true when x2 is infinity", () => {
    expect(overlap(1, Infinity, 4, 6)).toBe(true);
  });

  it("should return true when x3 is negative infinity", () => {
    expect(overlap(1, 5, -Infinity, 6)).toBe(true);
  });

  it("should return true when x4 is infinity", () => {
    expect(overlap(1, 5, 4, Infinity)).toBe(true);
  });
});
