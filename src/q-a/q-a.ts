// For reusability, allow x1 to equal x2 and x3 to equal x4 so it can be checked
// if a point in space overlaps with a range or another point in space. If this
// function may only be used for lines, then changing the greater than or equal
// to signs to strictly greater than signs will correct this.

export const overlap = (
  x1: number,
  x2: number,
  x3: number,
  x4: number
): boolean => {
  if (
    typeof x1 !== "number" ||
    typeof x2 !== "number" ||
    typeof x3 !== "number" ||
    typeof x4 !== "number"
  ) {
    throw new Error("All parameters must exist and be numbers");
  }

  // throw an error if NaN is used as an input, since in javascript NaN is a
  // number
  if (isNaN(x1) || isNaN(x2) || isNaN(x3) || isNaN(x4)) {
    throw new Error("All parameters must be real numbers (non NaN)");
  }

  // make sure the first inputs are from left to right for each line
  if (x1 > x2) throw new Error("x1 must be less than or equal to x2");
  if (x3 > x4) throw new Error("x3 must be less than or equal to x4");

  // If the points should be allowed to be out of order (eg: x1 > x2), then an
  // if check for x1 > x2 and x3 > x4 should not throw an error, but instead
  // swap the values of x1 and x2, and x3 and x4 using temporary variables.

  return x1 <= x4 && x3 <= x2;
};

if (process.env.NODE_ENV !== "test") {
  console.log("Line 1 to 5 overlaps line 4 to 6?", overlap(1, 5, 4, 6));
  console.log("Line -5 to -1 overlaps line 4 to 6?", overlap(-5, -1, 4, 6));
}
