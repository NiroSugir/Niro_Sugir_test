import { compareVersions } from "./q-b";

describe("Version Comparison Library", () => {
  // major, minor, and patch numbers
  it("should return 0 if both versions are equal with major, minor, and patch", () => {
    expect(compareVersions("1.2.3", "1.2.3")).toBe(0);
  });

  it("should return 1 if first version is greater with major, minor, and patch", () => {
    expect(compareVersions("1.2.4", "1.2.3")).toBe(1);
  });

  it("should return -1 if second version is greater with major, minor, and patch", () => {
    expect(compareVersions("1.2.2", "1.2.3")).toBe(-1);
  });

  // major and minor numbers only
  it("should return 0 if both versions are equal with major and minor", () => {
    expect(compareVersions("1.2", "1.2")).toBe(0);
  });

  it("should return 1 if first version is greater with major and minor", () => {
    expect(compareVersions("1.3", "1.2")).toBe(1);
  });

  it("should return -1 if second version is greater with major and minor", () => {
    expect(compareVersions("1.1", "1.2")).toBe(-1);
  });

  // major numbers only
  it("should return 0 if both versions are equal with major only", () => {
    expect(compareVersions("1", "1")).toBe(0);
  });

  it("should return 1 if first version is greater with major only", () => {
    expect(compareVersions("2", "1")).toBe(1);
  });

  it("should return -1 if second version is greater with major only", () => {
    expect(compareVersions("1", "2")).toBe(-1);
  });

  // different levels of precision
  it("should treat missing minor/patch as 0 and return 0 if versions are otherwise equal", () => {
    expect(compareVersions("1.2.0", "1.2")).toBe(0);
  });

  it("should treat missing minor/patch as 0 and return 1 if first version is greater", () => {
    expect(compareVersions("1.2.1", "1.2")).toBe(1);
  });

  it("should treat missing minor/patch as 0 and return -1 if second version is greater", () => {
    expect(compareVersions("1.2", "1.2.1")).toBe(-1);
  });

  // one version has more precision than the other
  it("should return 1 if first version has more precision and is greater", () => {
    expect(compareVersions("1.2.1", "1.2")).toBe(1);
  });

  it("should return -1 if second version has more precision and is greater", () => {
    expect(compareVersions("1.2", "1.2.2")).toBe(-1);
  });

  // invalid version strings
  it("should throw an error for invalid version strings", () => {
    expect(() => {
      compareVersions("1.2.banana", "1.2.2");
    }).toThrow();
  });

  // leading zeros
  it("should ignore leading zeros and return 0 if versions are equal", () => {
    expect(compareVersions("01.02.03", "1.2.3")).toBe(0);
  });

  it("should ignore leading zeros and return 1 if first version is greater", () => {
    expect(compareVersions("1.02.10", "1.2.3")).toBe(1);
  });

  it("should ignore leading zeros and return -1 if second version is greater", () => {
    expect(compareVersions("1.02.02", "1.2.3")).toBe(-1);
  });

  // different number of digits (patch v10 vs v3)
  it("should return 1 if first version with more digits is greater", () => {
    expect(compareVersions("1.2.10", "1.2.3")).toBe(1);
  });

  it("should return -1 if first version with more digits is lesser", () => {
    expect(compareVersions("1.2.3", "1.2.10")).toBe(-1);
  });

  // non-numeric characters
  it("should throw an error for version strings with non-numeric characters", () => {
    // first version
    expect(() => {
      compareVersions("1.2a.3", "1.2.3");
    }).toThrow();

    // second version
    expect(() => {
      compareVersions("1.2.3", "1.2.*");
    }).toThrow();
  });

  // trailing characters
  it("should throw an error for version strings with trailing characters", () => {
    expect(() => {
      compareVersions("1.2.3alpha", "1.2.3");
    }).toThrow();
  });

  // versions have spaces
  it("should handle or ignore spaces and return correct comparison result", () => {
    expect(compareVersions("1.2.3 ", " 1.2.3")).toBe(0);
  });

  // versions are empty strings
  it("should throw an error for empty version strings", () => {
    expect(() => {
      compareVersions("", "1.2.3");
    }).toThrow();
    expect(() => {
      compareVersions("", "");
    }).toThrow();
  });

  // versions are only separators
  it("should throw an error for version strings that are only dots", () => {
    expect(() => {
      compareVersions("...", "1.2.3");
    }).toThrow();
  });

  // negative numbers
  it("should throw an error for version strings with negative numbers", () => {
    expect(() => {
      compareVersions("-1.2.3", "1.2.3");
    }).toThrow();
  });
});
