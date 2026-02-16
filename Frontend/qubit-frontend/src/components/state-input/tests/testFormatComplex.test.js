import { formatComplex } from "../formatComplex";
import { expect, test } from "vitest";

/**
 * Test standard inputs
 */
test("returns valid real number for real number only (4)", () => {
  const result = formatComplex(4, 0);
  // Expect the result to be the string 4
  expect(result).toBeTypeOf("string");
  expect(result).toBe("4");
});

test("returns valid complex number for simple complex (3, 2)", () => {
  const result = formatComplex(3, 2);
  // Expect the result to be the string 3 + 2i
  expect(result).toBeTypeOf("string");
  expect(result).toBe("3 + 2i");
});

test("returns valid complex number even when including double values (3, 2.0)", () => {
  const result = formatComplex(3, 2.0);
  // Expect the result to be the string 3 + 2i (truncated 2.0 to 2)
  expect(result).toBeTypeOf("string");
  expect(result).toBe("3 + 2i");
});

test("returns valid complex number even when including double values (3, 2.01)", () => {
  const result = formatComplex(3, 2.01);
  // Expect the result to be the string 3 + 2i
  expect(result).toBeTypeOf("string");
  expect(result).toBe("3 + 2.01i");
});

test("returns valid complex number with correct sign (3, -2)", () => {
  const result = formatComplex(3, -2);
  // Expect the result to be the string 3 - 2i
  expect(result).toBeTypeOf("string");
  expect(result).toBe("3 - 2i");
});

test("returns valid complex number with correct sign when using doubles (3.01, -2.01)", () => {
  const result = formatComplex(3.01, -2.01);
  // Expect the result to be the string 3.01 - 2.01i
  expect(result).toBeTypeOf("string");
  expect(result).toBe("3.01 - 2.01i");
});

test("returns valid complex number with really long values (3000000000.01, -3000000000.01)", () => {
  const result = formatComplex(3000000000.01, -3000000000.01);
  // Expect the result to be the string 3000000000.01 - 3000000000.01i
  expect(result).toBeTypeOf("string");
  expect(result).toBe("3000000000.01 - 3000000000.01i");
});

test("returns valid number with really low precise floating point real number (0.00000000000000000000000001, 1)", () => {
  const result = formatComplex(0.00000000000000000000000001, 1);
  expect(result).toBeTypeOf("string");
  expect(result).toBe("1e-26 + 1i");
});

test("returns valid number with really low precise floating point complex number (0.00000000000000000000000001, 1)", () => {
  const result = formatComplex(1, 0.00000000000000000000000001);
  expect(result).toBeTypeOf("string");
  expect(result).toBe("1 + 1e-26i");
});

// Stateinput should prevent invalid answers. However, test that the failure results are as expected.
test("returns error text for recieving not a number (string of a number)", () => {
  const result = formatComplex("1", 0);
  // expect error string to be returned
  expect(result).toBeTypeOf("string");
  expect(result).toBe("Error in formatting. NaN or infinity");
});

test("returns error text for recieving not a number (1 / 0)", () => {
  const result = formatComplex(1 / 0, 0);
  expect(result).toBeTypeOf("string");
  expect(result).toBe("Error in formatting. NaN or infinity");
});

test("returns error text for recieving not a number in imaginary (1 / 0)", () => {
  const result = formatComplex(0, 1 / 0);
  expect(result).toBeTypeOf("string");
  expect(result).toBe("Error in formatting. NaN or infinity");
});

test("returns error text for recieving not a number (empty string in real)", () => {
  const result = formatComplex("", 0);
  expect(result).toBeTypeOf("string");
  expect(result).toBe("Error in formatting. NaN or infinity");
});

test("returns error text for recieving not a number (empty string in imaginary)", () => {
  const result = formatComplex(0, "");
  expect(result).toBeTypeOf("string");
  expect(result).toBe("Error in formatting. NaN or infinity");
});
