// helper function
const validateVersionCharacters = (s: string): void => {
  // versions may only have digits or dots
  if (!/^[0-9.]+$/.test(s)) throw new Error(`Invalid version string: ${s}`);
};

// helper function
const validateNotEmpty = (s: string): string => {
  // version numbers may not be empty between the dots
  if (s.trim().length === 0) throw new Error("Empty version part");

  return s;
};

/**
 * Simple version comparison function. Does not work for versions that contain
 * patch versions that include alpha, beta, release candidate, etc. If you want
 * infinite depth version comparison, it's best to use recursion. This assumes at
 * most 3 parts.
 *
 * @param v1 version (e.g. "1.2.3")
 * @param v2 version (e.g. "1.2.3")
 * @returns 0 if both versions are equal, 1 if first version is greater, -1 if second version is greater
 */
export const compareVersions = (v1: string, v2: string): number => {
  if (v1 == null || v2 == null) {
    throw new Error(`Invalid version string: ${v1 == null ? v1 : v2}`);
  }

  // Remove leading and trailing whitespaces
  v1 = v1.trim();
  v2 = v2.trim();

  // contains only numbers and dots
  validateVersionCharacters(v1);
  validateVersionCharacters(v2);

  // Split version numbers by dot
  const splitVersion1 = v1
    .split(".")
    .map((s) => s.trim())
    .map(validateNotEmpty);
  const splitVersion2 = v2
    .split(".")
    .map((s) => s.trim())
    .map(validateNotEmpty);

  // Compare each part of the version numbers
  for (
    let i = 0;
    i < Math.max(splitVersion1.length, splitVersion2.length);
    i++
  ) {
    // Treat missing minor/patch numbers as 0
    const num1 = i < splitVersion1.length ? parseInt(splitVersion1[i], 10) : 0;
    const num2 = i < splitVersion2.length ? parseInt(splitVersion2[i], 10) : 0;

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  // all parts are equal
  return 0;
};
