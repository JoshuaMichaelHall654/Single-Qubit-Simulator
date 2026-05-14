import { abs, sqrt, divide, complex, multiply } from "mathjs";

// Does all the calculation, but doesn't update any of the values (
// rawAlpha and rawBeta must be updated in state input card for
// synchronisity reasons. Eval alpha and beta can be updated
// anywhere, but since rawAlpha and beta are updated in stateInput,
// I have them change in state input as well.)
export function normalizeForMe(
  sqrNormalization,
  alphaCurrentVal,
  betaCurrentVal,
  setNormalizedStatus,
  setNormalizationError,
  addOrSubt,
) {
  // First, check if sqrNormalization is zero. If it is, figure out a way to
  // deal with this later. This function should not be callable when
  // sqrNormalization is zero, so it should be fine. TODO
  if (abs(sqrNormalization) <= 0.000000001) {
    setNormalizedStatus("error");
    setNormalizationError("Sqrnorm should not be 0");
    return;
  }

  // Next, calculate the sqrt of the squared normalization
  // factor (sqrt(N^2) = N) to get the normalization amplitude factor.
  const normAmpFactor = sqrt(sqrNormalization);

  // Normalize alpha and beta by dividing by N. Make sure to use math.divide
  // to handle division using complex value. Make sure its complex (even
  // though im pretty sure state input already made sure its
  // complex) using math.complex
  let alResult = divide(complex(alphaCurrentVal), normAmpFactor);
  let beResult = divide(complex(betaCurrentVal), normAmpFactor);

  // Check that the returned values are actually usable. Dont update our
  // values if normalizedStateResult is garbage/unusuable for whatever reason.
  // First, make sure alResult and beResult are not null
  if (alResult === null || beResult === null) {
    setNormalizedStatus("error");
    setNormalizationError("Normalization returned null for alpha or beta");
    return;
  }

  // Make sure that alpha and beta have valid real and imaginary numbers that are finite.
  if (!Number.isFinite(alResult.re) || !Number.isFinite(alResult.im)) {
    setNormalizedStatus("error");
    setNormalizationError(
      "Normalization returned real or imaginary values for alpha that are not allowed (NaN or Infinity)",
    );
    return;
  }
  if (!Number.isFinite(beResult.re) || !Number.isFinite(beResult.im)) {
    setNormalizedStatus("error");
    setNormalizationError(
      "Normalization returned real or imaginary values for beta that are not allowed (NaN or Infinity)",
    );
    return;
  }

  // If the user is subtracting by beta, make sure that the
  // negative value of beta is removed (to prevent --, which would be wrong)
  if (addOrSubt === false) {
    // multiply both values by negative 1, essentially distributing
    // a second negative one to cancel out the first distributed one.
    beResult = multiply(beResult, -1);
  }

  setNormalizedStatus("normalized");

  // Make an object to hold alResult and beResult
  const normalizedStateResult = { alpha: alResult, beta: beResult };

  // Return an object containing the new values we need
  return normalizedStateResult;
}
