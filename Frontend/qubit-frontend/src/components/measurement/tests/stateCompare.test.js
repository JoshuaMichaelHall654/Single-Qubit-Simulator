import { describe, expect, test } from "vitest";
import { maxComponentDiff } from "./stateCompare.js";

// The following code was created by claude 4.8 opus:

// Standing guard on the comparison metric the Qiskit cross-check depends on.
// The cross-check is only meaningful if this function actually reports a
// difference when one exists. If it ever silently degraded -- always returning
// 0, or ignoring a channel -- every cross-check comparison would pass vacuously
// and the whole suite would go green while testing nothing. These tests make
// that failure loud, without needing to re-inject a fake bug into the gates.

const state = (ar, ai, br, bi) => ({
  alpha: { re: ar, im: ai },
  beta: { re: br, im: bi },
});

describe("maxComponentDiff", () => {
  test("identical states report exactly zero", () => {
    // Guards the "equal means 0" direction: catches a metric that always
    // returns something nonzero.
    const s = state(0.1, -0.2, 0.3, 0.4);
    expect(maxComponentDiff(s, s)).toBe(0);
  });

  test("a difference in ANY single component is detected", () => {
    // Guards against a channel being dropped from the comparison entirely.
    const base = state(0, 0, 0, 0);
    expect(maxComponentDiff(base, state(0.5, 0, 0, 0))).toBe(0.5); // alpha.re
    expect(maxComponentDiff(base, state(0, 0.5, 0, 0))).toBe(0.5); // alpha.im
    expect(maxComponentDiff(base, state(0, 0, 0.5, 0))).toBe(0.5); // beta.re
    expect(maxComponentDiff(base, state(0, 0, 0, 0.5))).toBe(0.5); // beta.im
  });

  test("returns the LARGEST component difference, not the first or last", () => {
    const a = state(0, 0, 0, 0);
    const b = state(0.1, 0.2, 0.9, 0.3); // beta.re differs most
    expect(maxComponentDiff(a, b)).toBeCloseTo(0.9, 12);
  });

  test("a beta re/im swap is caught (the sabotage class)", () => {
    // Exactly the corruption used to smoke-test the harness -- and these are the
    // real numbers from that run. Swapping beta's re/im must register whenever
    // the two parts differ.
    const correct = state(0.111713, -0.444297, 0.600507, 0.655371);
    const swapped = state(0.111713, -0.444297, 0.655371, 0.600507);
    expect(maxComponentDiff(correct, swapped)).toBeGreaterThan(0.04);
  });

  test("a known-unequal pair clears the cross-check tolerance", () => {
    // Guards the "unequal means nonzero" direction against a metric that always
    // returns 0. This pair differs by 1, far above the 1e-10 threshold.
    expect(
      maxComponentDiff(state(1, 0, 0, 0), state(0, 0, 1, 0)),
    ).toBeGreaterThan(1e-10);
  });
});
