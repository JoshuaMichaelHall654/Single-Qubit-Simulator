import { expect, test } from "vitest";
import backendModule from "../../compiledBackend/backend.out";
import { cos, e, i, phi, pi, sin, sqrt, tau } from "mathjs";
import {
  checkNormalizationHelper,
  checkNormalization,
} from "../checkNormalization";
let backend = await backendModule();

// ================================================================
// SECTION 1: Standard input
// ================================================================

test("results are as expected for integers that are normalized (0, 1)", () => {
  const result = backend.hadamardGate({ re: 0, im: 0 }, { re: 1, im: 0 });
  // Alpha should become 1/sqrt(2). We want to be within 10^-9,
  // so we can use jest's built in "to be close to" with a value of 9.
  expect(result.alpha.re).toBeCloseTo(1 / sqrt(2), 9);
  expect(result.alpha.im).toBe(0);
  // Beta should become -1/sqrt(2)
  expect(result.beta.re).toBeCloseTo(-1 / sqrt(2), 9);
  expect(result.beta.im).toBe(0);
});

test("results are as expected for integers that are normalized (1, 0)", () => {
  const result = backend.hadamardGate({ re: 1, im: 0 }, { re: 0, im: 0 });
  // Alpha should become 1/sqrt(2)
  expect(result.alpha.re).toBeCloseTo(1 / sqrt(2), 9);
  expect(result.alpha.im).toBe(0);
  // Beta should become 1/sqrt(2)
  expect(result.beta.re).toBeCloseTo(1 / sqrt(2), 9);
  expect(result.beta.im).toBe(0);
});

test("results are as expected for one double and one integer that are normalized (0.0 , 1)", () => {
  const result = backend.hadamardGate({ re: 0.0, im: 0 }, { re: 1, im: 0 });
  // Alpha should become 1/sqrt(2)
  expect(result.alpha.re).toBeCloseTo(1 / sqrt(2), 9);
  expect(result.alpha.im).toBe(0);
  // Beta should become -1/sqrt(2)
  expect(result.beta.re).toBeCloseTo(-1 / sqrt(2), 9);
  expect(result.beta.im).toBe(0);
});

test("results are as expected for one double and one integer that are normalized (0 , 1.0)", () => {
  const result = backend.hadamardGate({ re: 1.0, im: 0 }, { re: 0, im: 0 });
  // Alpha should become 1/sqrt(2)
  expect(result.alpha.re).toBeCloseTo(1 / sqrt(2), 9);
  expect(result.alpha.im).toBe(0);
  // Beta should become 1/sqrt(2)
  expect(result.beta.re).toBeCloseTo(1 / sqrt(2), 9);
  expect(result.beta.im).toBe(0);
});
// ================================================================
// SECTION 2: States with symbols
// ================================================================

test("results are as expected for states using pi use that is normalized (1/pi, sqrt(1 - 1/pi^2))", () => {
  // Use checkNormalization to process alpha and beta from symbols into
  // numerical answers
  const result = checkNormalization("1/pi", "sqrt(1 - 1/pi^2)", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become  (1/π + sqrt(1 - 1/π²)) / √2
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (1 / pi + sqrt(1 - (1 / pi) ** 2)) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become  (1/π - sqrt(1 - 1/π²)) / √2
  expect(resultHadamard.beta.re).toBeCloseTo(
    (1 / pi - sqrt(1 - (1 / pi) ** 2)) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states with complex values using i that is normalized ((1 + i) / 2, (1 - i) / 2)", () => {
  // Use checkNormalization to process alpha and beta from symbols into
  // numerical answers
  const result = checkNormalization("(1 + i) / 2", "(1 - i) / 2", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become 1/sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(1 / sqrt(2), 9);
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become i/sqrt(2)
  expect(resultHadamard.beta.re).toBe(0);
  // being in the imaginary category means 1/sqrt(2) = i * 1/sqrt(2)
  expect(resultHadamard.beta.im).toBe(1 / sqrt(2));
});

test("results are as expected for states using e that is normalized (1/e, sqrt(1 - 1/e^2))", () => {
  const result = checkNormalization("1/e", "sqrt(1 - 1/e^2)", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become ((1/e) + sqrt(1-(1/e^2)))/sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (1 / e + sqrt(1 - 1 / e ** 2)) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become ((1/e) - sqrt(1-(1/e^2)))/sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (1 / e - sqrt(1 - 1 / e ** 2)) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using tau that is normalized (1/tau, sqrt(1 - 1/tau^2))", () => {
  const result = checkNormalization("1/tau", "sqrt(1 - 1/tau^2)", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become ((1/tau) + sqrt(1-(1/tau^2)))/sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (1 / tau + sqrt(1 - 1 / tau ** 2)) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become ((1/tau) - sqrt(1-(1/tau^2)))/sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (1 / tau - sqrt(1 - 1 / tau ** 2)) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using phi that is normalized (1/phi, 1/sqrt(phi))", () => {
  const result = checkNormalization("1/phi", "1/sqrt(phi)", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become ((1/phi) + (1/sqrt(phi)))/sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (1 / phi + 1 / sqrt(phi)) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become ((1/phi) - (1/sqrt(phi)))/sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (1 / phi - 1 / sqrt(phi)) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

// ================================================================
// SECTION 3: States with functions
// ================================================================

test("results are as expected for states using cos that is normalized (cos(pi/4), sin(pi/4))", () => {
  const result = checkNormalization("cos(pi/4)", "sin(pi/4)", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (cos(pi/4) + sin(pi/4)) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (cos(pi / 4) + sin(pi / 4)) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (cos(pi/4) - sin(pi/4)) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (cos(pi / 4) - sin(pi / 4)) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

/**
 * States with function normalized test
 */ /** 
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
*/
