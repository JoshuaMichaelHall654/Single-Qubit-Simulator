import { complex, sqrt } from "mathjs";
import { normalizeForMe } from "../normalizeForMe";
import { expect, test, vi } from "vitest";
import {
  e,
  i,
  phi,
  sqrt,
  pi,
  tau,
  abs,
  arg,
  complex,
  conj,
  exp,
  im,
  log,
  nthRoot,
  pow,
  re,
  cos,
  sin,
  asin,
  cot,
  csc,
  sec,
  tan,
  acos,
  acosh,
  acot,
  acsc,
  asec,
  asinh,
  atan,
  atanh,
  cosh,
  sinh,
  tanh,
} from "mathjs";

//
// SECTION 1: Successful normalizations
//

// 1A: Standard inputs
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

// 1B: Special symbols test
test("alpha and beta are correctly normalized for a state using e (e, 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |e|^2 + |1|^2 = e^2 + 1
  const sqrNormalization = e ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    e,
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be e / sqrt(e^2 + 1).
  // Beta should be 1 / sqrt(e^2 + 1).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    e / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);

  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using i (i, 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |i|^2 + |1|^2 = 1 + 1 = 2
  const sqrNormalization = 1 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    i,
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be i / sqrt(2), so re = 0, im = 1/sqrt(2).
  // Beta should be 1 / sqrt(2), so re = 1/sqrt(2), im = 0.
  expect(resultNormalization.alpha.re).toBe(0);
  expect(resultNormalization.alpha.im).toBeCloseTo(1 / sqrt(2), 9);
  expect(resultNormalization.beta.re).toBeCloseTo(1 / sqrt(2), 9);
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);

  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using phi (phi, 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |phi|^2 + |1|^2 = phi^2 + 1
  const sqrNormalization = phi ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    phi,
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be phi / sqrt(phi^2 + 1).
  // Beta should be 1 / sqrt(phi^2 + 1).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    phi / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);

  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using pi (pi, 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |pi|^2 + |1|^2 = pi^2 + 1
  const sqrNormalization = pi ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    pi,
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be pi / sqrt(pi^2 + 1).
  // Beta should be 1 / sqrt(pi^2 + 1).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    pi / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);

  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using tau (tau, 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |tau|^2 + |1|^2 = tau^2 + 1
  const sqrNormalization = tau ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    tau,
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be tau / sqrt(tau^2 + 1).
  // Beta should be 1 / sqrt(tau^2 + 1).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    tau / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);

  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using sqrt (sqrt(2), 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |sqrt(2)|^2 + |1|^2 = 2 + 1
  const sqrNormalization = sqrt(2) ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    sqrt(2),
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be sqrt(2) / sqrt(3).
  // Beta should be 1 / sqrt(3).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    sqrt(2) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

// 1C: Functions test

test("alpha and beta are correctly normalized for a state using abs (abs(-2), 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |abs(-2)|^2 + |1|^2 = 4 + 1
  const sqrNormalization = abs(-2) ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    abs(-2),
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be abs(-2) / sqrt(5).
  // Beta should be 1 / sqrt(5).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    abs(-2) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using arg (arg(complex(1, 1)), 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |arg(complex(1, 1))|^2 + |1|^2 = (pi/4)^2 + 1
  const sqrNormalization = arg(complex(1, 1)) ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    arg(complex(1, 1)),
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be arg(complex(1, 1)) / sqrt(sqrNorm).
  // Beta should be 1 / sqrt(sqrNorm).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    arg(complex(1, 1)) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using complex (complex(1, 2), complex(3, 4))", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |1+2i|^2 + |3+4i|^2 = 5 + 25
  const sqrNormalization = 5 + 25;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    complex(1, 2),
    complex(3, 4),
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be (1+2i) / sqrt(30): re = 1/sqrt(30), im = 2/sqrt(30).
  // Beta should be (3+4i) / sqrt(30): re = 3/sqrt(30), im = 4/sqrt(30).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBeCloseTo(
    2 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.re).toBeCloseTo(
    3 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBeCloseTo(
    4 / sqrt(sqrNormalization),
    9,
  );

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using conj (conj(complex(1, 1)), 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |1-i|^2 + |1|^2 = 2 + 1
  const sqrNormalization = 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    conj(complex(1, 1)),
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be (1-i) / sqrt(3): re = 1/sqrt(3), im = -1/sqrt(3).
  // Beta should be 1 / sqrt(3).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBeCloseTo(
    -1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using exp (exp(2), 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |exp(2)|^2 + |1|^2 = exp(2)^2 + 1
  const sqrNormalization = exp(2) ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    exp(2),
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be exp(2) / sqrt(sqrNorm).
  // Beta should be 1 / sqrt(sqrNorm).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    exp(2) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using im (im(complex(3, 4)), 3)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |im(complex(3, 4))|^2 + |3|^2 = 16 + 9
  const sqrNormalization = 16 + 9;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    im(complex(3, 4)),
    3,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be 4/5.
  // Beta should be 3/5.
  expect(resultNormalization.alpha.re).toBeCloseTo(
    im(complex(3, 4)) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    3 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using log (log(2), 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |log(2)|^2 + |1|^2
  const sqrNormalization = log(2) ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    log(2),
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be log(2) / sqrt(sqrNorm).
  // Beta should be 1 / sqrt(sqrNorm).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    log(2) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using nthRoot (nthRoot(8, 3), 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |nthRoot(8, 3)|^2 + |1|^2 = 4 + 1
  const sqrNormalization = nthRoot(8, 3) ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    nthRoot(8, 3),
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be nthRoot(8, 3) / sqrt(5) = 2/sqrt(5).
  // Beta should be 1/sqrt(5).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    nthRoot(8, 3) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using pow (pow(2, 3), 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |pow(2, 3)|^2 + |1|^2 = 64 + 1
  const sqrNormalization = pow(2, 3) ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    pow(2, 3),
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be pow(2, 3) / sqrt(65) = 8/sqrt(65).
  // Beta should be 1/sqrt(65).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    pow(2, 3) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using re (re(complex(3, 4)), 4)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |re(complex(3, 4))|^2 + |4|^2 = 9 + 16
  const sqrNormalization = 9 + 16;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    re(complex(3, 4)),
    4,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be 3/5.
  // Beta should be 4/5.
  expect(resultNormalization.alpha.re).toBeCloseTo(
    re(complex(3, 4)) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    4 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using cos (cos(pi/3), cos(pi/4))", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |cos(pi/3)|^2 + |cos(pi/4)|^2 = 1/4 + 1/2 = 3/4
  const sqrNormalization = cos(pi / 3) ** 2 + cos(pi / 4) ** 2;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    cos(pi / 3),
    cos(pi / 4),
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be cos(pi/3) / sqrt(3/4).
  // Beta should be cos(pi/4) / sqrt(3/4).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    cos(pi / 3) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    cos(pi / 4) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);

  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using sin (sin(pi/3), sin(pi/4))", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |sin(pi/3)|^2 + |sin(pi/4)|^2 = 3/4 + 1/2
  const sqrNormalization = sin(pi / 3) ** 2 + sin(pi / 4) ** 2;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    sin(pi / 3),
    sin(pi / 4),
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be sin(pi/3) / sqrt(sqrNorm).
  // Beta should be sin(pi/4) / sqrt(sqrNorm).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    sin(pi / 3) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    sin(pi / 4) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using asin (asin(1/2), 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |asin(1/2)|^2 + |1|^2 = (pi/6)^2 + 1
  const sqrNormalization = asin(1 / 2) ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    asin(1 / 2),
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be asin(1/2) / sqrt(sqrNorm).
  // Beta should be 1 / sqrt(sqrNorm).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    asin(1 / 2) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using cot (cot(pi/3), cot(pi/4))", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |cot(pi/3)|^2 + |cot(pi/4)|^2 = 1/3 + 1
  const sqrNormalization = cot(pi / 3) ** 2 + cot(pi / 4) ** 2;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    cot(pi / 3),
    cot(pi / 4),
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be cot(pi/3) / sqrt(sqrNorm).
  // Beta should be cot(pi/4) / sqrt(sqrNorm).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    cot(pi / 3) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    cot(pi / 4) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using csc (csc(pi/6), csc(pi/4))", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |csc(pi/6)|^2 + |csc(pi/4)|^2 = 4 + 2
  const sqrNormalization = csc(pi / 6) ** 2 + csc(pi / 4) ** 2;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    csc(pi / 6),
    csc(pi / 4),
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be csc(pi/6) / sqrt(sqrNorm).
  // Beta should be csc(pi/4) / sqrt(sqrNorm).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    csc(pi / 6) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    csc(pi / 4) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using sec (sec(pi/3), sec(pi/4))", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |sec(pi/3)|^2 + |sec(pi/4)|^2 = 4 + 2
  const sqrNormalization = sec(pi / 3) ** 2 + sec(pi / 4) ** 2;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    sec(pi / 3),
    sec(pi / 4),
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be sec(pi/3) / sqrt(sqrNorm).
  // Beta should be sec(pi/4) / sqrt(sqrNorm).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    sec(pi / 3) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    sec(pi / 4) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using tan (tan(pi/4), tan(pi/3))", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |tan(pi/4)|^2 + |tan(pi/3)|^2 = 1 + 3
  const sqrNormalization = tan(pi / 4) ** 2 + tan(pi / 3) ** 2;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    tan(pi / 4),
    tan(pi / 3),
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be tan(pi/4) / sqrt(sqrNorm).
  // Beta should be tan(pi/3) / sqrt(sqrNorm).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    tan(pi / 4) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    tan(pi / 3) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using acos (acos(1/2), 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |acos(1/2)|^2 + |1|^2 = (pi/3)^2 + 1
  const sqrNormalization = acos(1 / 2) ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    acos(1 / 2),
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be acos(1/2) / sqrt(sqrNorm).
  // Beta should be 1 / sqrt(sqrNorm).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    acos(1 / 2) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using acosh (acosh(2), 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |acosh(2)|^2 + |1|^2
  const sqrNormalization = acosh(2) ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    acosh(2),
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be acosh(2) / sqrt(sqrNorm).
  // Beta should be 1 / sqrt(sqrNorm).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    acosh(2) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using acot (acot(1), 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |acot(1)|^2 + |1|^2 = (pi/4)^2 + 1
  const sqrNormalization = acot(1) ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    acot(1),
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be acot(1) / sqrt(sqrNorm).
  // Beta should be 1 / sqrt(sqrNorm).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    acot(1) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using acsc (acsc(2), 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |acsc(2)|^2 + |1|^2 = (pi/6)^2 + 1
  const sqrNormalization = acsc(2) ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    acsc(2),
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be acsc(2) / sqrt(sqrNorm).
  // Beta should be 1 / sqrt(sqrNorm).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    acsc(2) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using asec (asec(2), 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |asec(2)|^2 + |1|^2 = (pi/3)^2 + 1
  const sqrNormalization = asec(2) ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    asec(2),
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be asec(2) / sqrt(sqrNorm).
  // Beta should be 1 / sqrt(sqrNorm).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    asec(2) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using asinh (asinh(1), 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |asinh(1)|^2 + |1|^2
  const sqrNormalization = asinh(1) ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    asinh(1),
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be asinh(1) / sqrt(sqrNorm).
  // Beta should be 1 / sqrt(sqrNorm).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    asinh(1) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using atan (atan(1), 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |atan(1)|^2 + |1|^2 = (pi/4)^2 + 1
  const sqrNormalization = atan(1) ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    atan(1),
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be atan(1) / sqrt(sqrNorm).
  // Beta should be 1 / sqrt(sqrNorm).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    atan(1) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using atanh (atanh(1/2), 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |atanh(1/2)|^2 + |1|^2
  const sqrNormalization = atanh(1 / 2) ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    atanh(1 / 2),
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be atanh(1/2) / sqrt(sqrNorm).
  // Beta should be 1 / sqrt(sqrNorm).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    atanh(1 / 2) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using cosh (cosh(1), 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |cosh(1)|^2 + |1|^2
  const sqrNormalization = cosh(1) ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    cosh(1),
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be cosh(1) / sqrt(sqrNorm).
  // Beta should be 1 / sqrt(sqrNorm).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    cosh(1) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using sinh (sinh(1), 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |sinh(1)|^2 + |1|^2
  const sqrNormalization = sinh(1) ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    sinh(1),
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be sinh(1) / sqrt(sqrNorm).
  // Beta should be 1 / sqrt(sqrNorm).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    sinh(1) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

test("alpha and beta are correctly normalized for a state using tanh (tanh(1), 1)", () => {
  const setNormalizedStatus = vi.fn();
  const setNormalizedError = vi.fn();

  // |tanh(1)|^2 + |1|^2
  const sqrNormalization = tanh(1) ** 2 + 1;

  const resultNormalization = normalizeForMe(
    sqrNormalization,
    tanh(1),
    1,
    setNormalizedStatus,
    setNormalizedError,
    true,
  );

  // Alpha should be tanh(1) / sqrt(sqrNorm).
  // Beta should be 1 / sqrt(sqrNorm).
  expect(resultNormalization.alpha.re).toBeCloseTo(
    tanh(1) / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.alpha.im).toBe(0);
  expect(resultNormalization.beta.re).toBeCloseTo(
    1 / sqrt(sqrNormalization),
    9,
  );
  expect(resultNormalization.beta.im).toBe(0);

  expect(setNormalizedError).toBeCalledTimes(0);
  expect(setNormalizedStatus).toHaveBeenCalledWith("normalized");
  expect(setNormalizedStatus).toBeCalledTimes(1);
});

//
// SECTION 2: Errors
//
