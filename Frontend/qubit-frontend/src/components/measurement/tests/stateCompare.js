// Pure comparison metric shared by the Qiskit cross-check (QiskitReference_test.js)
// and its unit test (stateCompare.test.js). Deliberately side-effect-free so it
// can be exercised in isolation; the running-max tracking the cross-check needs
// lives in that test file, wrapped around this.
//
// A state is { alpha: { re, im }, beta: { re, im } }.

// Largest absolute difference across the four real components of two states.
// Component-wise (not fidelity), so it is phase-SENSITIVE: two states that are
// equal up to a global phase register as different. That is intended for the six
// standard gates (no phase-convention offset vs Qiskit); revisit this metric if
// phase-carrying gates like RZ are ever added.
export function maxComponentDiff(a, b) {
  return Math.max(
    Math.abs(a.alpha.re - b.alpha.re),
    Math.abs(a.alpha.im - b.alpha.im),
    Math.abs(a.beta.re - b.beta.re),
    Math.abs(a.beta.im - b.beta.im),
  );
}
