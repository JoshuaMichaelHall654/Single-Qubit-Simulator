import { complex, sqrt } from "mathjs";
import { normalizeForMe } from "../normalizeForMe";
import { expect, test, vi } from "vitest";
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

//
// SECTION 1: Successful normalizations
//
test("alpha and beta are correctly normalized for a state of only real numbers that need to be normalized (1,1)", () => {
  // We need variables for setNormalized status and error to be able to call normalize for me. However,
  // status and error are both hook functions, which can not be created in a test.js file.
  // We can get around this by using mocking functions like vi.fn().
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // vi.fn() just has the functions return undefined when called.
  // To actually know what happens (or doesn't happen) to our function, use
  // mockImplementation to add an implementation.

  // Create the string that will hold the text of setNormalized error and status.
  // Have error default to say "clear", as that string is unused for error.
  // Status text should change from clear to normalized after successful normalizations.
  let errorText = "clear";
  let statusText = "clear";

  // error will save the given string into error text
  setNormalizedError.mockImplementation((a) => {
    errorText = a;
  });

  // Status will do similarly
  setNormalizedStatus.mockImplementation((a) => {
    statusText = a;
  });

  // Calculate the square normalization (normalizeforme expects it,
  // as its precalculated in the original program), |a|^2 + |b|^2
  // |a|^2 = aa*, which is always real and non negative.
  const sqrNormalization = 1 + 1;

  // normalizeForMe returns an object, so we need to first grab the object.
  // the true at the end represents addOrSubtract set to true:
  // which means alpha and beta are added together
  const resultNormalization = normalizeForMe(
    sqrNormalization,
    1,
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Check if the state was normalized properly. alpha and beta
  // should become 1 / sqrt(2), and have no imaginary component.
  expect(resultNormalization.alpha.re).toBeCloseTo(1 / sqrt(2));
  expect(resultNormalization.alpha.im).toBeCloseTo(0);
  expect(resultNormalization.beta.re).toBeCloseTo(1 / sqrt(2));
  expect(resultNormalization.beta.im).toBeCloseTo(0);

  // check if error wasn't called (which indicates a lack of errors)
  expect(errorText).toBe("clear");
  expect(setNormalizedError).toBeCalledTimes(0);

  // Status should be set to normalized and called once
  expect(statusText).toBe("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state of only real numbers that need to be normalized (2,0)", () => {
  // Create the string that will hold the text of setNormalized error and status.
  // Have them default to say "clear", as its a sentinel to show it hasn't been reassigned
  let errorText = "clear";
  let statusText = "clear";

  // mock implementations can be passed directly into the function declaration
  const setNormalizedStatus = vi.fn((a) => {
    statusText = a;
  });
  const setNormalizedError = vi.fn((a) => {
    errorText = a;
  });

  const sqrNormalization = 4 + 0;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    2,
    0,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be re = 1, im = 0.
  // Beta should be re = 0, im = 0.
  expect(resultNormalization.alpha.re).toBeCloseTo(1);
  expect(resultNormalization.alpha.im).toBeCloseTo(0);
  expect(resultNormalization.beta.re).toBeCloseTo(0);
  expect(resultNormalization.beta.im).toBeCloseTo(0);

  expect(errorText).toBe("clear");
  expect(setNormalizedError).toBeCalledTimes(0);

  expect(statusText).toBe("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state of real and imaginary numbers that need to be normalized (i,i)", () => {
  // You can remove the functionality as well as the variables entirely using
  // "toHaveBeenCalledWith" (see below).
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  const sqrNormalization = 2;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    complex(0, 1),
    complex(0, 1),
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be re = 0, im = 1/sqrt(2).
  // Beta should be re = 0, im = 1/sqrt(2).
  expect(resultNormalization.alpha.re).toBeCloseTo(0);
  expect(resultNormalization.alpha.im).toBeCloseTo(1 / sqrt(2));
  expect(resultNormalization.beta.re).toBeCloseTo(0);
  expect(resultNormalization.beta.im).toBeCloseTo(1 / sqrt(2));

  expect(setNormalizedError).toBeCalledTimes(0);

  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state of real and imaginary numbers that need to be normalized (2i,0)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  const sqrNormalization = 4 + 0;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    complex(0, 2),
    0,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be re = 0, im = 1.
  // Beta should be re = 0, im = 0.
  expect(resultNormalization.alpha.re).toBeCloseTo(0);
  expect(resultNormalization.alpha.im).toBeCloseTo(1);
  expect(resultNormalization.beta.re).toBeCloseTo(0);
  expect(resultNormalization.beta.im).toBeCloseTo(0);

  expect(setNormalizedError).toBeCalledTimes(0);

  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

// NOTE: the following test cases were written by Claude.ai following the structure of the above test cases.
// Test cases are the only place where AI generated code is used in this software.

test("alpha and beta are correctly normalized for a state of only real numbers with different magnitudes (3,4)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  const sqrNormalization = 9 + 16;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    3,
    4,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be re = 3/5, im = 0.
  // Beta should be re = 4/5, im = 0.
  expect(resultNormalization.alpha.re).toBeCloseTo(3 / 5);
  expect(resultNormalization.alpha.im).toBeCloseTo(0);
  expect(resultNormalization.beta.re).toBeCloseTo(4 / 5);
  expect(resultNormalization.beta.im).toBeCloseTo(0);

  expect(setNormalizedError).toBeCalledTimes(0);

  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state of only real numbers including a negative value (-1,1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  const sqrNormalization = 1 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    -1,
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be re = -1/sqrt(2), im = 0.
  // Beta should be re = 1/sqrt(2), im = 0.
  expect(resultNormalization.alpha.re).toBeCloseTo(-1 / sqrt(2));
  expect(resultNormalization.alpha.im).toBeCloseTo(0);
  expect(resultNormalization.beta.re).toBeCloseTo(1 / sqrt(2));
  expect(resultNormalization.beta.im).toBeCloseTo(0);

  expect(setNormalizedError).toBeCalledTimes(0);

  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized when one component has both real and imaginary parts (1+i,0)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |1+i|^2 + |0|^2 = 2 + 0
  const sqrNormalization = 2 + 0;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    complex(1, 1),
    0,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be re = 1/sqrt(2), im = 1/sqrt(2).
  // Beta should be re = 0, im = 0.
  expect(resultNormalization.alpha.re).toBeCloseTo(1 / sqrt(2));
  expect(resultNormalization.alpha.im).toBeCloseTo(1 / sqrt(2));
  expect(resultNormalization.beta.re).toBeCloseTo(0);
  expect(resultNormalization.beta.im).toBeCloseTo(0);

  expect(setNormalizedError).toBeCalledTimes(0);

  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized when both components have real and imaginary parts (1+i,1-i)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |1+i|^2 + |1-i|^2 = 2 + 2
  const sqrNormalization = 2 + 2;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    complex(1, 1),
    complex(1, -1),
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be re = 1/2, im = 1/2.
  // Beta should be re = 1/2, im = -1/2.
  expect(resultNormalization.alpha.re).toBeCloseTo(0.5);
  expect(resultNormalization.alpha.im).toBeCloseTo(0.5);
  expect(resultNormalization.beta.re).toBeCloseTo(0.5);
  expect(resultNormalization.beta.im).toBeCloseTo(-0.5);

  expect(setNormalizedError).toBeCalledTimes(0);

  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized when one component is purely real and the other purely imaginary (1,i)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  const sqrNormalization = 1 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    1,
    complex(0, 1),
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be re = 1/sqrt(2), im = 0.
  // Beta should be re = 0, im = 1/sqrt(2).
  expect(resultNormalization.alpha.re).toBeCloseTo(1 / sqrt(2));
  expect(resultNormalization.alpha.im).toBeCloseTo(0);
  expect(resultNormalization.beta.re).toBeCloseTo(0);
  expect(resultNormalization.beta.im).toBeCloseTo(1 / sqrt(2));

  expect(setNormalizedError).toBeCalledTimes(0);

  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for an already-normalized state (1,0)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // State is already normalized: |1|^2 + |0|^2 = 1.
  // Normalization should be a no-op (dividing by sqrt(1) = 1).
  const sqrNormalization = 1 + 0;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    1,
    0,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be re = 1, im = 0.
  // Beta should be re = 0, im = 0.
  expect(resultNormalization.alpha.re).toBeCloseTo(1);
  expect(resultNormalization.alpha.im).toBeCloseTo(0);
  expect(resultNormalization.beta.re).toBeCloseTo(0);
  expect(resultNormalization.beta.im).toBeCloseTo(0);

  expect(setNormalizedError).toBeCalledTimes(0);

  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state of only real numbers when subtracted (1,1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  const sqrNormalization = 1 + 1;

  // addOrSubt = false flips the sign of beta after normalization.
  const resultNormalization = normalizeForMe(
    sqrNormalization,
    1,
    1,
    setNormalizedStatus,
    setNormalizedError,
    false,
  );

  // Alpha should be re = 1/sqrt(2), im = 0.
  // Beta should be re = -1/sqrt(2), im = 0.
  expect(resultNormalization.alpha.re).toBeCloseTo(1 / sqrt(2));
  expect(resultNormalization.alpha.im).toBeCloseTo(0);
  expect(resultNormalization.beta.re).toBeCloseTo(-1 / sqrt(2));
  expect(resultNormalization.beta.im).toBeCloseTo(0);

  expect(setNormalizedError).toBeCalledTimes(0);

  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state of only imaginary numbers when subtracted (i,i)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  const sqrNormalization = 2;

  // addOrSubt = false flips the sign of beta after normalization.
  const resultNormalization = normalizeForMe(
    sqrNormalization,
    complex(0, 1),
    complex(0, 1),
    setNormalizedStatus,
    setNormalizedError,
    false,
  );

  // Alpha should be re = 0, im = 1/sqrt(2).
  // Beta should be re = 0, im = -1/sqrt(2).
  expect(resultNormalization.alpha.re).toBeCloseTo(0);
  expect(resultNormalization.alpha.im).toBeCloseTo(1 / sqrt(2));
  expect(resultNormalization.beta.re).toBeCloseTo(0);
  expect(resultNormalization.beta.im).toBeCloseTo(-1 / sqrt(2));

  expect(setNormalizedError).toBeCalledTimes(0);

  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized when both components have real and imaginary parts when subtracted (1+i,1-i)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |1+i|^2 + |1-i|^2 = 2 + 2
  const sqrNormalization = 2 + 2;

  // addOrSubt = false flips the sign of beta after normalization.
  const resultNormalization = normalizeForMe(
    sqrNormalization,
    complex(1, 1),
    complex(1, -1),
    setNormalizedStatus,
    setNormalizedError,
    false,
  );

  // Alpha should be re = 1/2, im = 1/2.
  // Beta should be re = -1/2, im = 1/2 (beta's sign is flipped).
  expect(resultNormalization.alpha.re).toBeCloseTo(0.5);
  expect(resultNormalization.alpha.im).toBeCloseTo(0.5);
  expect(resultNormalization.beta.re).toBeCloseTo(-0.5);
  expect(resultNormalization.beta.im).toBeCloseTo(0.5);

  expect(setNormalizedError).toBeCalledTimes(0);

  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state of only imaginary numbers including a negative value (-i,i)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  const sqrNormalization = 1 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    complex(0, -1),
    complex(0, 1),
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be re = 0, im = -1/sqrt(2).
  // Beta should be re = 0, im = 1/sqrt(2).
  expect(resultNormalization.alpha.re).toBeCloseTo(0);
  expect(resultNormalization.alpha.im).toBeCloseTo(-1 / sqrt(2));
  expect(resultNormalization.beta.re).toBeCloseTo(0);
  expect(resultNormalization.beta.im).toBeCloseTo(1 / sqrt(2));

  expect(setNormalizedError).toBeCalledTimes(0);

  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state with very small but valid magnitudes (1e-4,1e-4)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |1e-4|^2 + |1e-4|^2 = 1e-8 + 1e-8 = 2e-8.
  // sqrNormalization is well outside the 1e-9 epsilon window,
  // so it should normalize successfully rather than firing the guard.
  const sqrNormalization = 1e-8 + 1e-8;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    1e-4,
    1e-4,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be re = 1/sqrt(2), im = 0.
  // Beta should be re = 1/sqrt(2), im = 0.
  expect(resultNormalization.alpha.re).toBeCloseTo(1 / sqrt(2));
  expect(resultNormalization.alpha.im).toBeCloseTo(0);
  expect(resultNormalization.beta.re).toBeCloseTo(1 / sqrt(2));
  expect(resultNormalization.beta.im).toBeCloseTo(0);

  expect(setNormalizedError).toBeCalledTimes(0);

  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

//
// SECTION 2: Errors
//
