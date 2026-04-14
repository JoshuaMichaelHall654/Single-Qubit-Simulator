import { expect, test } from "vitest";
import backendModule from "../../compiledBackend/backend.out";
import {
  asin,
  cos,
  cot,
  csc,
  e,
  i,
  phi,
  pi,
  sec,
  sin,
  sqrt,
  tan,
  tau,
  acos,
  acosh,
  acot,
  acsc,
  asec,
  asinh,
  atan,
  atanh,
  abs,
  arg,
  complex,
  conj,
  cosh,
  exp,
  im,
  log,
  nthRoot,
  pow,
  re,
  sinh,
  tanh,
} from "mathjs";
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

test("results are as expected for states using sin that is normalized (sin(pi/6), sqrt(1 - sin(pi/6)^2))", () => {
  const result = checkNormalization("sin(pi/6)", "sqrt(1 - sin(pi/6)^2)", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (sin(pi/6) + sqrt(1 - sin(pi/6)^2)/sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (sin(pi / 6) + sqrt(1 - sin(pi / 6) ** 2)) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Alpha should become (sin(pi/6) - sqrt(1 - sin(pi/6)^2)/sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (sin(pi / 6) - sqrt(1 - sin(pi / 6) ** 2)) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using tan that is normalized (tan(pi/8), sqrt(1 - tan(pi/8)^2))", () => {
  const result = checkNormalization("tan(pi/8)", "sqrt(1 - tan(pi/8)^2)", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (tan(pi/8) + sqrt(1 - tan(pi/8)^2)/sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (tan(pi / 8) + sqrt(1 - tan(pi / 8) ** 2)) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (tan(pi/8) - sqrt(1 - tan(pi/8)^2)/sqrt(2)),
  expect(resultHadamard.beta.re).toBeCloseTo(
    (tan(pi / 8) - sqrt(1 - tan(pi / 8) ** 2)) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using cot that is normalized (cot(pi/3) / sqrt(1 + cot(pi/3)^2), 1 / sqrt(1 + cot(pi/3)^2)", () => {
  const result = checkNormalization(
    "cot(pi/3) / sqrt(1 + cot(pi/3)^2)",
    "1 / sqrt(1 + cot(pi/3)^2)",
    true,
  );
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become ((cot(pi/3) / sqrt(1 + cot(pi/3)^2)) + (1 / sqrt(1 + cot(pi/3)^2)))/sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (cot(pi / 3) / sqrt(1 + cot(pi / 3) ** 2) +
      1 / sqrt(1 + cot(pi / 3) ** 2)) /
      sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become ((cot(pi/3) / sqrt(1 + cot(pi/3)^2)) - (1 / sqrt(1 + cot(pi/3)^2)))/sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (cot(pi / 3) / sqrt(1 + cot(pi / 3) ** 2) -
      1 / sqrt(1 + cot(pi / 3) ** 2)) /
      sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using sec that is normalized (1 / sec(pi/3), sqrt(1 - (1/sec(pi/3))^2))", () => {
  const result = checkNormalization(
    "1 / sec(pi/3)",
    "sqrt(1 - (1/sec(pi/3))^2)",
    true,
  );
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become ((1 / sec(pi/3)) + (sqrt(1 - (1/sec(pi/3))^2))))/sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (1 / sec(pi / 3) + sqrt(1 - 1 / sec(pi / 3) ** 2)) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become ((1 / sec(pi/3)) - (sqrt(1 - (1/sec(pi/3))^2))))/sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (1 / sec(pi / 3) - sqrt(1 - 1 / sec(pi / 3) ** 2)) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using csc that is normalized (1 / csc(pi/6), sqrt(1 - (1/csc(pi/6))^2)", () => {
  const result = checkNormalization(
    "1 / csc(pi/6)",
    "sqrt(1 - (1/csc(pi/6))^2)",
    true,
  );
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become ((1 / csc(pi/6)) + (sqrt(1 - (1/csc(pi/6))^2)/sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (1 / csc(pi / 6) + sqrt(1 - (1 / csc(pi / 6)) ** 2)) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // beta should become ((1 / csc(pi/6)) - (sqrt(1 - (1/csc(pi/6))^2)/sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (1 / csc(pi / 6) - sqrt(1 - (1 / csc(pi / 6)) ** 2)) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using asin that is normalized (cos(asin(1/2)), sin(asin(1/2))", () => {
  const result = checkNormalization("cos(asin(1/2))", "sin(asin(1/2))", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (cos(asin(1 / 2)) + sin(asin(1 / 2))) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (cos(asin(1 / 2)) + sin(asin(1 / 2))) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // beta should become (cos(asin(1 / 2)) - sin(asin(1 / 2))) / sqrt(2),
  expect(resultHadamard.beta.re).toBeCloseTo(
    (cos(asin(1 / 2)) - sin(asin(1 / 2))) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using acos that is normalized (cos(acos(1/2)), sin(acos(1/2)))", () => {
  const result = checkNormalization("cos(acos(1/2))", "sin(acos(1/2))", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (cos(acos(1/2)) + sin(acos(1/2))) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (cos(acos(1 / 2)) + sin(acos(1 / 2))) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (cos(acos(1/2)) - sin(acos(1/2))) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (cos(acos(1 / 2)) - sin(acos(1 / 2))) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using atan that is normalized (cos(atan(1)), sin(atan(1)))", () => {
  const result = checkNormalization("cos(atan(1))", "sin(atan(1))", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (cos(atan(1)) + sin(atan(1))) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (cos(atan(1)) + sin(atan(1))) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (cos(atan(1)) - sin(atan(1))) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (cos(atan(1)) - sin(atan(1))) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using sqrt that is normalized (sqrt(1/3), sqrt(2/3))", () => {
  const result = checkNormalization("sqrt(1/3)", "sqrt(2/3)", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (sqrt(1/3) + sqrt(2/3)) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (sqrt(1 / 3) + sqrt(2 / 3)) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (sqrt(1/3) - sqrt(2/3)) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (sqrt(1 / 3) - sqrt(2 / 3)) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using acot that is normalized (cos(acot(sqrt(3))), sin(acot(sqrt(3))))", () => {
  const result = checkNormalization(
    "cos(acot(sqrt(3)))",
    "sin(acot(sqrt(3)))",
    true,
  );
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (cos(acot(sqrt(3))) + sin(acot(sqrt(3)))) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (cos(acot(sqrt(3))) + sin(acot(sqrt(3)))) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (cos(acot(sqrt(3))) - sin(acot(sqrt(3)))) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (cos(acot(sqrt(3))) - sin(acot(sqrt(3)))) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using asec that is normalized (cos(asec(2)), sin(asec(2)))", () => {
  const result = checkNormalization("cos(asec(2))", "sin(asec(2))", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (cos(asec(2)) + sin(asec(2))) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (cos(asec(2)) + sin(asec(2))) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (cos(asec(2)) - sin(asec(2))) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (cos(asec(2)) - sin(asec(2))) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using acsc that is normalized (sin(acsc(2)), cos(acsc(2)))", () => {
  const result = checkNormalization("sin(acsc(2))", "cos(acsc(2))", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (sin(acsc(2)) + cos(acsc(2))) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (sin(acsc(2)) + cos(acsc(2))) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (sin(acsc(2)) - cos(acsc(2))) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (sin(acsc(2)) - cos(acsc(2))) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using sinh that is normalized (sinh(1) / cosh(1), 1 / cosh(1))", () => {
  const result = checkNormalization("sinh(1) / cosh(1)", "1 / cosh(1)", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (sinh(1) / cosh(1) + 1 / cosh(1)) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (sinh(1) / cosh(1) + 1 / cosh(1)) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (sinh(1) / cosh(1) - 1 / cosh(1)) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (sinh(1) / cosh(1) - 1 / cosh(1)) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using cosh that is normalized (1 / cosh(1), sqrt(1 - 1/cosh(1)^2))", () => {
  const result = checkNormalization(
    "1 / cosh(1)",
    "sqrt(1 - 1/cosh(1)^2)",
    true,
  );
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (1 / cosh(1) + sqrt(1 - (1 / cosh(1))^2)) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (1 / cosh(1) + sqrt(1 - (1 / cosh(1)) ** 2)) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (1 / cosh(1) - sqrt(1 - (1 / cosh(1))^2)) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (1 / cosh(1) - sqrt(1 - (1 / cosh(1)) ** 2)) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using tanh that is normalized (tanh(1), 1 / cosh(1))", () => {
  const result = checkNormalization("tanh(1)", "1 / cosh(1)", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (tanh(1) + 1 / cosh(1)) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (tanh(1) + 1 / cosh(1)) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (tanh(1) - 1 / cosh(1)) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (tanh(1) - 1 / cosh(1)) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using asinh that is normalized (cos(asinh(1)), sin(asinh(1)))", () => {
  const result = checkNormalization("cos(asinh(1))", "sin(asinh(1))", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (cos(asinh(1)) + sin(asinh(1))) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (cos(asinh(1)) + sin(asinh(1))) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (cos(asinh(1)) - sin(asinh(1))) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (cos(asinh(1)) - sin(asinh(1))) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using acosh that is normalized (cos(acosh(2)), sin(acosh(2)))", () => {
  const result = checkNormalization("cos(acosh(2))", "sin(acosh(2))", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (cos(acosh(2)) + sin(acosh(2))) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (cos(acosh(2)) + sin(acosh(2))) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (cos(acosh(2)) - sin(acosh(2))) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (cos(acosh(2)) - sin(acosh(2))) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using atanh that is normalized (cos(atanh(1/2)), sin(atanh(1/2)))", () => {
  const result = checkNormalization("cos(atanh(1/2))", "sin(atanh(1/2))", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (cos(atanh(1/2)) + sin(atanh(1/2))) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (cos(atanh(1 / 2)) + sin(atanh(1 / 2))) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (cos(atanh(1/2)) - sin(atanh(1/2))) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (cos(atanh(1 / 2)) - sin(atanh(1 / 2))) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using nthRoot that is normalized (1 / nthRoot(8, 3), sqrt(3) / 2)", () => {
  const result = checkNormalization("1 / nthRoot(8, 3)", "sqrt(3) / 2", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (1 / nthRoot(8, 3) + sqrt(3) / 2) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (1 / nthRoot(8, 3) + sqrt(3) / 2) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (1 / nthRoot(8, 3) - sqrt(3) / 2) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (1 / nthRoot(8, 3) - sqrt(3) / 2) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using exp that is normalized (exp(-1), sqrt(1 - exp(-2)))", () => {
  const result = checkNormalization("exp(-1)", "sqrt(1 - exp(-2))", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (exp(-1) + sqrt(1 - exp(-2))) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (exp(-1) + sqrt(1 - exp(-2))) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (exp(-1) - sqrt(1 - exp(-2))) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (exp(-1) - sqrt(1 - exp(-2))) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using log that is normalized (log(sqrt(e)), sqrt(3) / 2)", () => {
  const result = checkNormalization("log(sqrt(e))", "sqrt(3) / 2", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (log(sqrt(e)) + sqrt(3) / 2) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (log(sqrt(e)) + sqrt(3) / 2) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (log(sqrt(e)) - sqrt(3) / 2) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (log(sqrt(e)) - sqrt(3) / 2) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using pow that is normalized (pow(4, -1/2), sqrt(3) / 2)", () => {
  const result = checkNormalization("pow(4, -1/2)", "sqrt(3) / 2", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (pow(4, -1/2) + sqrt(3) / 2) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (pow(4, -1 / 2) + sqrt(3) / 2) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (pow(4, -1/2) - sqrt(3) / 2) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (pow(4, -1 / 2) - sqrt(3) / 2) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using abs that is normalized (abs(complex(-3, -4)) / 10, sqrt(3) / 2)", () => {
  const result = checkNormalization(
    "abs(complex(-3, -4)) / 10",
    "sqrt(3) / 2",
    true,
  );
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (abs(complex(-3, -4)) / 10 + sqrt(3) / 2) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (abs(complex(-3, -4)) / 10 + sqrt(3) / 2) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (abs(complex(-3, -4)) / 10 - sqrt(3) / 2) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (abs(complex(-3, -4)) / 10 - sqrt(3) / 2) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using arg that is normalized (cos(arg(complex(1, 1))), sin(arg(complex(1, 1))))", () => {
  const result = checkNormalization(
    "cos(arg(complex(1, 1)))",
    "sin(arg(complex(1, 1)))",
    true,
  );
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (cos(arg(complex(1, 1))) + sin(arg(complex(1, 1)))) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (cos(arg(complex(1, 1))) + sin(arg(complex(1, 1)))) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (cos(arg(complex(1, 1))) - sin(arg(complex(1, 1)))) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (cos(arg(complex(1, 1))) - sin(arg(complex(1, 1)))) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using conj that is normalized (conj(complex(1, -1)) / 2, conj(complex(1, 1)) / 2)", () => {
  // alpha = complex(1, 1) / 2, beta = complex(1, -1) / 2 after conj
  // alpha + beta = complex(1, 0), alpha - beta = complex(0, 1)
  const result = checkNormalization(
    "conj(complex(1, -1)) / 2",
    "conj(complex(1, 1)) / 2",
    true,
  );
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become complex(1, 0) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(1 / sqrt(2), 9);
  expect(resultHadamard.alpha.im).toBeCloseTo(0, 9);
  // Beta should become complex(0, 1) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(0, 9);
  expect(resultHadamard.beta.im).toBeCloseTo(1 / sqrt(2), 9);
});

test("results are as expected for states using re that is normalized (re(complex(3, 4)) / 5, 4/5)", () => {
  const result = checkNormalization("re(complex(3, 4)) / 5", "4/5", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (re(complex(3, 4)) / 5 + 4/5) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (re(complex(3, 4)) / 5 + 4 / 5) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (re(complex(3, 4)) / 5 - 4/5) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (re(complex(3, 4)) / 5 - 4 / 5) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using im that is normalized (im(complex(3, 4)) / 5, 3/5)", () => {
  const result = checkNormalization("im(complex(3, 4)) / 5", "3/5", true);
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become (im(complex(3, 4)) / 5 + 3/5) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(
    (im(complex(3, 4)) / 5 + 3 / 5) / sqrt(2),
    9,
  );
  expect(resultHadamard.alpha.im).toBe(0);
  // Beta should become (im(complex(3, 4)) / 5 - 3/5) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(
    (im(complex(3, 4)) / 5 - 3 / 5) / sqrt(2),
    9,
  );
  expect(resultHadamard.beta.im).toBe(0);
});

test("results are as expected for states using complex that is normalized (complex(1, 1) / 2, complex(1, -1) / 2)", () => {
  // alpha = complex(1, 1) / 2, beta = complex(1, -1) / 2
  // alpha + beta = complex(1, 0), alpha - beta = complex(0, 1)
  const result = checkNormalization(
    "complex(1, 1) / 2",
    "complex(1, -1) / 2",
    true,
  );
  const resultHadamard = backend.hadamardGate(result.alphaNum, result.betaNum);
  // Alpha should become complex(1, 0) / sqrt(2)
  expect(resultHadamard.alpha.re).toBeCloseTo(1 / sqrt(2), 9);
  expect(resultHadamard.alpha.im).toBeCloseTo(0, 9);
  // Beta should become complex(0, 1) / sqrt(2)
  expect(resultHadamard.beta.re).toBeCloseTo(0, 9);
  expect(resultHadamard.beta.im).toBeCloseTo(1 / sqrt(2), 9);
});
