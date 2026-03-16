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
test("results are unnormalized for two integers added together (1, 1, +)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("1", "1", true);
  // Make sure checkNormalization returns not normalized
  expect(result.resultOfCheck).toBe("not normalized");
});

test("results are unnormalized for two integers subtracted (1, 1, -)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("1", "1", false);
  // Make sure checkNormalization returns not normalized
  expect(result.resultOfCheck).toBe("not normalized");
});

test("results are unnormalized for one integer and one double added together (1, 1.0, +)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("1", "1.0", true);
  // Make sure checkNormalization returns not normalized
  expect(result.resultOfCheck).toBe("not normalized");
});

test("results are unnormalized for one integer and one double subtracted (1, 1.0, -)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("1", "1.0", false);
  // Make sure checkNormalization returns not normalized
  expect(result.resultOfCheck).toBe("not normalized");
});

test("results are unnormalized for one double value and one integer added together (1.0, 1, +)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("1.0", "1", true);
  // Make sure checkNormalization returns not normalized
  expect(result.resultOfCheck).toBe("not normalized");
});

test("results are unnormalized for one double value and one integer subtracted (1.0, 1, -)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("1.0", "1", false);
  // Make sure checkNormalization returns not normalized
  expect(result.resultOfCheck).toBe("not normalized");
});

test("results are unnormalized for two double values added (1.0, 1.0, +)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("1.0", "1.0", true);
  // Make sure checkNormalization returns not normalized
  expect(result.resultOfCheck).toBe("not normalized");
});

test("results are unnormalized for two double values subtracted (1.0, 1.0, -)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("1.0", "1.0", false);
  // Make sure checkNormalization returns not normalized
  expect(result.resultOfCheck).toBe("not normalized");
});

test("results are unnormalized for one large double added to an integer (1.00000000001, 1, +)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("1.00000000001", "1", true);
  // Make sure checkNormalization returns not normalized
  expect(result.resultOfCheck).toBe("not normalized");
});

test("results are unnormalized for one large double subtracted from an integer (1.00000000001, 1, -)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("1.00000000001", "1", false);
  // Make sure checkNormalization returns not normalized
  expect(result.resultOfCheck).toBe("not normalized");
});

test("results are unnormalized for doubles greater than our 10^-11 margin of error added (.00001, 1, +)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization(".00001", "1", true);
  // Make sure checkNormalization returns not normalized
  expect(result.resultOfCheck).toBe("not normalized");
});

test("results are unnormalized for doubles greater than our 10^-11 margin of error subtracted (.00001, 1, -)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization(".00001", "1", false);
  // Make sure checkNormalization returns not normalized
  expect(result.resultOfCheck).toBe("not normalized");
});

// Check normalization handles expressions, including complex numbers and functions
test("results are unnormalized for user_test_2 added (1 + 2i, 2 + 3i, +)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("1 + 2i", "2 + 3i", true);
  // Make sure checkNormalization returns normalized
  expect(result.resultOfCheck).toBe("not normalized");
});

test("results are unnormalized for user_test_2 subtracted (1 + 2i, 2 + 3i, -)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("1 + 2i", "2 + 3i", false);
  // Make sure checkNormalization returns normalized
  expect(result.resultOfCheck).toBe("not normalized");
});

test("results are unnormalized for user_test_3 added (sin(2i^3), 3^i * 4, +)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("sin(2i^3)", "3^i * 4", true);
  // Make sure checkNormalization returns normalized
  expect(result.resultOfCheck).toBe("not normalized");
});

test("results are unnormalized for user_test_3 subtracted (sin(2i^3), 3^i * 4, +)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("sin(2i^3)", "3^i * 4", false);
  // Make sure checkNormalization returns normalized
  expect(result.resultOfCheck).toBe("not normalized");
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
test("results are normalized for integers that are normalized when added (0, 1, +)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("0", "1", true);
  // Make sure checkNormalization returns normalized
  expect(result.resultOfCheck).toBe("normalized");
});

test("results are normalized for integers that are normalized when subtracted (0, 1, -)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("0", "1", false);
  // Make sure checkNormalization returns normalized
  expect(result.resultOfCheck).toBe("normalized");
});

test("results are normalized for integers that are normalized when added (1, 0, +)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("1", "0", true);
  // Make sure checkNormalization returns normalized
  expect(result.resultOfCheck).toBe("normalized");
});

test("results are normalized for integers that are normalized when subtracted (1, 0, -)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("1", "0", false);
  // Make sure checkNormalization returns normalized
  expect(result.resultOfCheck).toBe("normalized");
});

test("results are normalized for one double and one integer that are normalized and added (0.0 , 1, +)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("0.0", "1", true);
  // Make sure checkNormalization returns normalized
  expect(result.resultOfCheck).toBe("normalized");
});

test("results are normalized for one double and one integer that are normalized and subtracted (0.0 , 1, -)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("0.0", "1", false);
  // Make sure checkNormalization returns normalized
  expect(result.resultOfCheck).toBe("normalized");
});

test("results are normalized for one double and one integer that are normalized added together (0, 1.0, +)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("0", "1.0", true);
  // Make sure checkNormalization returns normalized
  expect(result.resultOfCheck).toBe("normalized");
});

test("results are normalized for one double and one integer that are normalized subtracted (0, 1.0, -)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("0", "1.0", false);
  // Make sure checkNormalization returns normalized
  expect(result.resultOfCheck).toBe("normalized");
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
test("results are normalized for less than 10^-11 margin added (0.000001, 1, +)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("0.000001", "1", true);
  // Make sure checkNormalization returns normalized even though its not
  expect(result.resultOfCheck).toBe("normalized");
});

test("results are normalized for less than 10^-11 margin subtracted (0.000001, 1, -)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const result = checkNormalization("0.000001", "1", false);
  // Make sure checkNormalization returns normalized even though its not
  expect(result.resultOfCheck).toBe("normalized");
});
