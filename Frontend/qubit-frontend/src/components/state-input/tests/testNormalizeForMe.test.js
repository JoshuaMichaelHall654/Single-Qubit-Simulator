import { sqrt } from "mathjs";
import { normalizeForMe } from "../normalizeForMe";
import { expect, test } from "vitest";
import { useState } from "react";

//
// SECTION 1: Successful normalizations
//
test("returns the correct normalized values for real numbers that need to be normalized (1,1)", () => {
  // Make a normalized status and normalized error variables. However,
  // use react hooks can't be used here, so replace them with standard booleans.
  let normalizedStatus = vi.fn();
  let normalizedError = false;

  // Calculate the square normalization (normalizeforme expects it,
  // as its precalculated in the original program), |a|^2 + |b|^2
  // |a|^2 = aa*, which is always real and non negative.
  const sqrNormalization = 1 + 1;
  // returns an object, so we need to first grab the object.
  // the true at the end represents addOrSubtract set to true:
  // which means we add the values.
  const resultNormalization = normalizeForMe(
    sqrNormalization,
    1,
    1,
    normalizedStatus,
    normalizedError,
    true,
  );
  // Check if it normalized it properly
  expect(resultNormalization.alpha).toBeCloseTo(1 / sqrt(2));
  expect(resultNormalization.alpha).toBeCloseTo(1 / sqrt(2));
});

//
// SECTION 2: Errors
//
