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
  // Testing + vs - is just for sanity. Normalziation is
  // not affected by the sign of alpha/beta
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

/**
 * States with symbols normalized test
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

test("results return normalized for states using tau that is normalized (1/tau, sqrt(1 - 1/tau^2), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("1/tau", "sqrt(1 - 1/tau^2)", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("1/tau", "sqrt(1 - 1/tau^2)", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using phi that is normalized (1/phi, 1/sqrt(phi), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("1/phi", "1/sqrt(phi)", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("1/phi", "1/sqrt(phi)", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using SQRT1_2 that is normalized (SQRT1_2, SQRT1_2, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("SQRT1_2", "SQRT1_2", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("SQRT1_2", "SQRT1_2", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using SQRT2 that is normalized (1/SQRT2, 1/SQRT2, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("1/SQRT2", "1/SQRT2", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("1/SQRT2", "1/SQRT2", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

/**
 * States with function normalized test
 */
test("results return normalized for states using cos that is normalized (cos(pi/4), sin(pi/4), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("cos(pi/4)", "sin(pi/4)", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("cos(pi/4)", "sin(pi/4)", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using sin that is normalized (sin(pi/6), sqrt(1 - sin(pi/6)^2), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization(
    "sin(pi/6)",
    "sqrt(1 - sin(pi/6)^2)",
    true,
  );
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization(
    "sin(pi/6)",
    "sqrt(1 - sin(pi/6)^2)",
    false,
  );
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using tan that is normalized (tan(pi/8), sqrt(1 - tan(pi/8)^2), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization(
    "tan(pi/8)",
    "sqrt(1 - tan(pi/8)^2)",
    true,
  );
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization(
    "tan(pi/8)",
    "sqrt(1 - tan(pi/8)^2)",
    false,
  );
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using cot that is normalized (cot(pi/3) / sqrt(1 + cot(pi/3)^2), 1 / sqrt(1 + cot(pi/3)^2), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization(
    "cot(pi/3) / sqrt(1 + cot(pi/3)^2)",
    "1 / sqrt(1 + cot(pi/3)^2)",
    true,
  );
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization(
    "cot(pi/3) / sqrt(1 + cot(pi/3)^2)",
    "1 / sqrt(1 + cot(pi/3)^2)",
    false,
  );
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using sec that is normalized (1 / sec(pi/3), sqrt(1 - (1/sec(pi/3))^2), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization(
    "1 / sec(pi/3)",
    "sqrt(1 - (1/sec(pi/3))^2)",
    true,
  );
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization(
    "1 / sec(pi/3)",
    "sqrt(1 - (1/sec(pi/3))^2)",
    false,
  );
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using csc that is normalized (1 / csc(pi/6), sqrt(1 - (1/csc(pi/6))^2), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization(
    "1 / csc(pi/6)",
    "sqrt(1 - (1/csc(pi/6))^2)",
    true,
  );
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization(
    "1 / csc(pi/6)",
    "sqrt(1 - (1/csc(pi/6))^2)",
    false,
  );
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using asin that is normalized (cos(asin(1/2)), sin(asin(1/2)), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization(
    "cos(asin(1/2))",
    "sin(asin(1/2))",
    true,
  );
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization(
    "cos(asin(1/2))",
    "sin(asin(1/2))",
    false,
  );
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using acos that is normalized (cos(acos(1/2)), sin(acos(1/2)), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization(
    "cos(acos(1/2))",
    "sin(acos(1/2))",
    true,
  );
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization(
    "cos(acos(1/2))",
    "sin(acos(1/2))",
    false,
  );
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using atan that is normalized (cos(atan(1)), sin(atan(1)), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("cos(atan(1))", "sin(atan(1))", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("cos(atan(1))", "sin(atan(1))", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using sqrt that is normalized (sqrt(1/3), sqrt(2/3), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("sqrt(1/3)", "sqrt(2/3)", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("sqrt(1/3)", "sqrt(2/3)", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using acot that is normalized (cos(acot(sqrt(3))), sin(acot(sqrt(3))), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization(
    "cos(acot(sqrt(3)))",
    "sin(acot(sqrt(3)))",
    true,
  );
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization(
    "cos(acot(sqrt(3)))",
    "sin(acot(sqrt(3)))",
    false,
  );
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using asec that is normalized (cos(asec(2)), sin(asec(2)), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("cos(asec(2))", "sin(asec(2))", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("cos(asec(2))", "sin(asec(2))", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using acsc that is normalized (sin(acsc(2)), cos(acsc(2)), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("sin(acsc(2))", "cos(acsc(2))", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("sin(acsc(2))", "cos(acsc(2))", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using sinh that is normalized (sinh(1) / cosh(1), 1 / cosh(1), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization(
    "sinh(1) / cosh(1)",
    "1 / cosh(1)",
    true,
  );
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization(
    "sinh(1) / cosh(1)",
    "1 / cosh(1)",
    false,
  );
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using cosh that is normalized (1 / cosh(1), sqrt(1 - 1/cosh(1)^2), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization(
    "1 / cosh(1)",
    "sqrt(1 - 1/cosh(1)^2)",
    true,
  );
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization(
    "1 / cosh(1)",
    "sqrt(1 - 1/cosh(1)^2)",
    false,
  );
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using tanh that is normalized (tanh(1), 1 / cosh(1), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("tanh(1)", "1 / cosh(1)", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("tanh(1)", "1 / cosh(1)", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using asinh that is normalized (cos(asinh(1)), sin(asinh(1)), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("cos(asinh(1))", "sin(asinh(1))", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMin = checkNormalization("cos(asinh(1))", "sin(asinh(1))", false);
  expect(resultMin.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using acosh that is normalized (cos(acosh(2)), sin(acosh(2)), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("cos(acosh(2))", "sin(acosh(2))", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMin = checkNormalization("cos(acosh(2))", "sin(acosh(2))", false);
  expect(resultMin.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using atanh that is normalized (cos(atanh(1/2)), sin(atanh(1/2)), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization(
    "cos(atanh(1/2))",
    "sin(atanh(1/2))",
    true,
  );
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization(
    "cos(atanh(1/2))",
    "sin(atanh(1/2))",
    false,
  );
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using nthRoot that is normalized (1 / nthRoot(8, 3), sqrt(3) / 2, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization(
    "1 / nthRoot(8, 3)",
    "sqrt(3) / 2",
    true,
  );
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization(
    "1 / nthRoot(8, 3)",
    "sqrt(3) / 2",
    false,
  );
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using exp that is normalized (exp(-1), sqrt(1 - exp(-2)), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("exp(-1)", "sqrt(1 - exp(-2))", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("exp(-1)", "sqrt(1 - exp(-2))", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using log that is normalized (log(sqrt(e)), sqrt(3) / 2, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("log(sqrt(e))", "sqrt(3) / 2", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("log(sqrt(e))", "sqrt(3) / 2", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using pow that is normalized (pow(4, -1/2), sqrt(3) / 2, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("pow(4, -1/2)", "sqrt(3) / 2", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("pow(4, -1/2)", "sqrt(3) / 2", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using abs that is normalized (abs(complex(-3, -4)) / 10, sqrt(3) / 2, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization(
    "abs(complex(-3, -4)) / 10",
    "sqrt(3) / 2",
    true,
  );
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization(
    "abs(complex(-3, -4)) / 10",
    "sqrt(3) / 2",
    false,
  );
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using arg that is normalized (cos(arg(complex(1, 1))), sin(arg(complex(1, 1))), +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization(
    "cos(arg(complex(1, 1)))",
    "sin(arg(complex(1, 1)))",
    true,
  );
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization(
    "cos(arg(complex(1, 1)))",
    "sin(arg(complex(1, 1)))",
    false,
  );
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using conj that is normalized (conj(complex(1, -1)) / 2, conj(complex(1, 1)) / 2, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization(
    "conj(complex(1, -1)) / 2",
    "conj(complex(1, 1)) / 2",
    true,
  );
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization(
    "conj(complex(1, -1)) / 2",
    "conj(complex(1, 1)) / 2",
    false,
  );
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using re that is normalized (re(complex(3, 4)) / 5, 4/5, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("re(complex(3, 4)) / 5", "4/5", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("re(complex(3, 4)) / 5", "4/5", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using im that is normalized (im(complex(3, 4)) / 5, 3/5, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization("im(complex(3, 4)) / 5", "3/5", true);
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization("im(complex(3, 4)) / 5", "3/5", false);
  expect(resultMinus.resultOfCheck).toBe("normalized");
});

test("results return normalized for states using complex that is normalized (complex(1, 1) / 2, complex(1, -1) / 2, +/-)", () => {
  // + = true, - = false. Check normalization expects strings from
  // the user typing
  const resultPlus = checkNormalization(
    "complex(1, 1) / 2",
    "complex(1, -1) / 2",
    true,
  );
  // Make sure checkNormalization returns normalized
  expect(resultPlus.resultOfCheck).toBe("normalized");
  const resultMinus = checkNormalization(
    "complex(1, 1) / 2",
    "complex(1, -1) / 2",
    false,
  );
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
