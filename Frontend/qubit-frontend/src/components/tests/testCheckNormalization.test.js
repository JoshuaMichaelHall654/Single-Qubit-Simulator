import { expect, test } from "vitest";
import { checkNormalizationHelper } from "../checkNormalization";
import { abs } from "mathjs";
/**
 * Test for unnormalized correctly recognized
 */
test("results are unnormalized for integer values (1,1)", () => {
  const result = checkNormalizationHelper(1, 1);
  // Make sure its not normalized
  expect(abs(result.sqrNorm - 1) < 0.00000000001).toBe(false);
});

test("results are unnormalized for one integer and one double values (1,1.0)", () => {
  const result = checkNormalizationHelper(1, 1.0);
  // Make sure its not normalized
  expect(abs(result.sqrNorm - 1) < 0.00000000001).toBe(false);
});

test("results are unnormalized for one integer and one double values (1.0,1)", () => {
  const result = checkNormalizationHelper(1.0, 1);
  // Make sure its not normalized
  expect(abs(result.sqrNorm - 1) < 0.00000000001).toBe(false);
});

test("results are unnormalized for two double values (1.0,1.0)", () => {
  const result = checkNormalizationHelper(1.0, 1.0);
  // Make sure its not normalized
  expect(abs(result.sqrNorm - 1) < 0.00000000001).toBe(false);
});

test("results are unnormalized for one large double (1.00000000001, 1)", () => {
  const result = checkNormalizationHelper(1.00000000001, 1);
  // Make sure its not normalized
  expect(abs(result.sqrNorm - 1) < 0.00000000001).toBe(false);
});

test("results are unnormalized for doubles within our 10^-11 margin of error (.00001, 1)", () => {
  const result = checkNormalizationHelper(0.00001, 1);
  // Make sure its not normalized
  expect(abs(result.sqrNorm - 1) < 0.00000000001).toBe(false);
});

/**
 * Check for normalization
 */
test("results are normalized for integers that are normalized (0, 1)", () => {
  const result = checkNormalizationHelper(0, 1);
  // Make sure it is normalized
  expect(abs(result.sqrNorm - 1) < 0.00000000001).toBe(true);
});

test("results are normalized for integers that are normalized (1, 0)", () => {
  const result = checkNormalizationHelper(1, 0);
  // Make sure it is normalized
  expect(abs(result.sqrNorm - 1) < 0.00000000001).toBe(true);
});

test("results are normalized for one double and one integer that are normalized (0.0 , 1)", () => {
  const result = checkNormalizationHelper(0.0, 1);
  // Make sure it is normalized
  expect(abs(result.sqrNorm - 1) < 0.00000000001).toBe(true);
});
test("results are normalized for one double and one integer that are normalized (0, 1.0)", () => {
  const result = checkNormalizationHelper(0, 1.0);
  // Make sure it is normalized
  expect(abs(result.sqrNorm - 1) < 0.00000000001).toBe(true);
});

/**
 * Test edge cases
 */
test("results are normalized for more than 10^10 margin (0.000001, 1)", () => {
  // We check that the result is 1 within 1 * 10^-11 precision.
  // We have alpha = .000001, which is 1 * 10^-6. checkNormalizationHelper
  // will do alpha * alphaComplexConj, which is just alpha * alpha for real numbers,
  // giving 1 * 10^-6  * 1 * 10^-6 = 10^-12. Since 10^-12 < 10^-11,
  // it is outside of our margin of error, and therefore will be recognized as
  // normalized, even though it is technically not.
  const result = checkNormalizationHelper(0.000001, 1);
  // Make sure it is normalized
  expect(abs(result.sqrNorm - 1) < 0.00000000001).toBe(true);
});
