import { expect, test } from "vitest";
import {
  checkNormalizationHelper,
  checkNormalization,
} from "../checkNormalization";
import { abs } from "mathjs";

// ================================================================
// SECTION 1: UNNORMALIZED
// ================================================================

/**
 * Helper function tests: unnormalized inputs
 */
test("helper correctly calculates norm and prob for integer (1, 1)", () => {
  const result = checkNormalizationHelper(1, 1);
  // Make sure its not normalized directly
  expect(abs(result.sqrNorm - 1) < 0.00000000001).toBe(false);
  // Make sure the correct alpha and beta probabilities are returned
  // (its just 1 since these are not yet normalized)
  expect(result.alphaProb).toBe(1);
  expect(result.betaProb).toBe(1);
});

// In Js, 1.0 and 1 are the same number. So, the tests for check normalization
// helper using combinations of 1.0 and 1 have been removed. They are kept
// for checkNormalization, as there we are testing that it recognizes
// strings, not numbers.

test("helper correctly returns norm and prob for one large double (1.00000000001, 1)", () => {
  const result = checkNormalizationHelper(1.00000000001, 1);
  // Make sure its not normalized
  expect(abs(result.sqrNorm - 1) < 0.00000000001).toBe(false);
  // Make sure the correct alpha and beta probabilities are returned.
  // A floating point error dictates that alpha will be 1.00000000002,
  // so just check that its within the range of 1 (must be
  // looser than 1e-11)
  expect(abs(result.alphaProb - 1) < 0.000000001).toBe(true);
  expect(result.betaProb).toBe(1);
});

test("helper correctly returns norm and prob for doubles greater than our 10^-11 margin of error (.00001, 1)", () => {
  const result = checkNormalizationHelper(0.00001, 1);
  // Make sure its not normalized
  expect(abs(result.sqrNorm - 1) < 0.00000000001).toBe(false);
  // Make sure the correct alpha and beta probabilities are returned.
  // A floating point error will occur with alpha, so make sure
  // its within the range of 0.
  expect(abs(result.alphaProb) < 0.00001).toBe(true);
  expect(result.betaProb).toBe(1);
});

/**
 * Main function tests: unnormalized inputs
 */
test("results are unnormalized for two integers (1, 1, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("1", "1", true);
  // Make sure checkNormalization returns not normalized
  expect(resultPlus.resultOfCheck).toBe("not normalized");
  const resultMinus = checkNormalization("1", "1", false);
  expect(resultMinus.resultOfCheck).toBe("not normalized");
});

test("results are unnormalized for one integer and one double (1, 1.0, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("1", "1.0", true);
  // Make sure checkNormalization returns not normalized
  expect(resultPlus.resultOfCheck).toBe("not normalized");
  const resultMinus = checkNormalization("1", "1.0", false);
  expect(resultMinus.resultOfCheck).toBe("not normalized");
});

test("results are unnormalized for one double value and one integer (1.0, 1, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("1.0", "1", true);
  // Make sure checkNormalization returns not normalized
  expect(resultPlus.resultOfCheck).toBe("not normalized");
  const resultMinus = checkNormalization("1.0", "1", false);
  expect(resultMinus.resultOfCheck).toBe("not normalized");
});

test("results are unnormalized for two double values (1.0, 1.0, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("1.0", "1.0", true);
  // Make sure checkNormalization returns not normalized
  expect(resultPlus.resultOfCheck).toBe("not normalized");
  const resultMinus = checkNormalization("1.0", "1.0", false);
  expect(resultMinus.resultOfCheck).toBe("not normalized");
});

test("results are unnormalized for one large double and one integer (1.00000000001, 1, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("1.00000000001", "1", true);
  // Make sure checkNormalization returns not normalized
  expect(resultPlus.resultOfCheck).toBe("not normalized");
  const resultMinus = checkNormalization("1.00000000001", "1", false);
  expect(resultMinus.resultOfCheck).toBe("not normalized");
});

test("results are unnormalized for doubles greater than our 10^-11 margin of error (.00001, 1, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization(".00001", "1", true);
  // Make sure checkNormalization returns not normalized
  expect(resultPlus.resultOfCheck).toBe("not normalized");
  const resultMinus = checkNormalization(".00001", "1", false);
  expect(resultMinus.resultOfCheck).toBe("not normalized");
});

// Check normalization handles expressions, including complex numbers and functions
test("results are unnormalized for user_test_2  (1 + 2i, 2 + 3i, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("1 + 2i", "2 + 3i", true);
  // Make sure checkNormalization returns not normalized
  expect(resultPlus.resultOfCheck).toBe("not normalized");
  const resultMinus = checkNormalization("1 + 2i", "2 + 3i", false);
  expect(resultMinus.resultOfCheck).toBe("not normalized");
});

test("results are unnormalized for user_test_3 (sin(2i^3), 3^i * 4, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("sin(2i^3)", "3^i * 4", true);
  // Make sure checkNormalization returns not normalized
  expect(resultPlus.resultOfCheck).toBe("not normalized");
  const resultMinus = checkNormalization("sin(2i^3)", "3^i * 4", false);
  expect(resultMinus.resultOfCheck).toBe("not normalized");
});

// ================================================================
// SECTION 2: NORMALIZED
// ================================================================

/**
 * Helper function tests: normalized inputs
 */
test("helper correctly returns norm and prob for integers (0, 1)", () => {
  const result = checkNormalizationHelper(0, 1);
  // Make sure it is normalized
  expect(abs(result.sqrNorm - 1) < 0.00000000001).toBe(true);
  expect(result.alphaProb).toBe(0);
  expect(result.betaProb).toBe(1);
});

test("helper correctly returns norm and prob for integers (1, 0)", () => {
  const result = checkNormalizationHelper(1, 0);
  // Make sure it is normalized
  expect(abs(result.sqrNorm - 1) < 0.00000000001).toBe(true);
  expect(result.alphaProb).toBe(1);
  expect(result.betaProb).toBe(0);
});

/**
 * Main function tests: normalized inputs
 */
test("results are normalized for integers that are normalized (0, 1, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("0", "1", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("0", "1", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results are normalized for integers that are normalized (1, 0, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("1", "0", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("1", "0", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results are normalized for one double and one integer that are normalized (0.0 , 1, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("0.0", "1", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("0.0", "1", false);
  // Make sure checkNormalization returns normalized
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results are normalized for one double and one integer that are normalized (0, 1.0, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("0", "1.0", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("0", "1.0", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

// List of symbols:
/**
  "e",
  "E",
  "tau",
  "phi",
  "SQRT1_2",
  "SQRT2",
 */
test("results return normalized for states using pi use that is normalized (1/pi, sqrt(1 - 1/pi^2), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("1/pi", "sqrt(1 - 1/pi^2)", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("1/pi", "sqrt(1 - 1/pi^2)", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using PI use that is normalized (1/PI, sqrt(1 - 1/PI^2), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("1/PI", "sqrt(1 - 1/PI^2)", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("1/PI", "sqrt(1 - 1/PI^2)", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states with complex values using i that is normalized ((1 + i) / 2, (1 - i) / 2, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("(1 + i) / 2", "(1 - i) / 2", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("(1 + i) / 2", "(1 - i) / 2", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using e that is normalized (1/e, sqrt(1 - 1/e^2), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("1/e", "sqrt(1 - 1/e^2)", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("1/e", "sqrt(1 - 1/e^2)", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using E that is normalized (1/E, sqrt(1 - 1/E^2), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("1/E", "sqrt(1 - 1/E^2)", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("1/E", "sqrt(1 - 1/E^2)", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

// List of functions:
/**
 * "cos", "sin", "tan", "cot", "sec", "csc", "asin", "acos",
  "atan",
  "sqrt",
  "acot",
  "asec",
  "acsc",
  "sinh",
  "cosh",
  "tanh",
  "asinh",
  "acosh",
  "atanh",
  "nthRoot",
  "exp",
  "log",
  "pow",
  "abs",
  "arg",
  "conj",
  "re",
  "im",
  "complex",
 */
test("results are normalized for valid cos uses (cos(pi/2), 1.0, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("0", "1.0", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("0", "1.0", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

// ================================================================
// SECTION 3: EDGE CASES
// ================================================================

/**
 * Helper function tests: edge cases
 */
test("helper function returns correct probs and incorrect norm on input that is less than our 10^-11 margin (0.000001, 1)", () => {
  // We check that the result is 1 within 1 * 10^-11 precision.
  // We have alpha = .000001, which is 1 * 10^-6. checkNormalizationHelper
  // will do alpha * alphaComplexConj, which is just alpha * alpha for real numbers,
  // giving 1 * 10^-6  * 1 * 10^-6 = 10^-12. Since 10^-12 < 10^-11,
  // it is less than our margin of error, and therefore will be recognized as
  // normalized, even though it is technically not.
  const result = checkNormalizationHelper(0.000001, 1);
  // Make sure it says its normalized
  expect(abs(result.sqrNorm - 1) < 0.00000000001).toBe(true);
  // Both alpha and beta should be correct, only norm should be wrong.
  // Alpha prob should be 0 within a margin of error.
  expect(abs(result.alphaProb) < 0.00001).toBe(true);
  expect(result.betaProb).toBe(1);
});

/**
 * Main function tests: edge cases
 */
test("results are normalized for less than 10^-11 margin (0.000001, 1, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("0.000001", "1", true);
  // Make sure checkNormalization returns normalized even though it "shouldn't" be
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("0.000001", "1", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});
