import backendModule from "../../compiledBackend/backend.out";
const backend = await backendModule();

// Does all the calculation, but doesn't update any of the values (
// rawAlpha and beta must be updated in state input card for
// synchronisity reasons. Eval alpha and beta can be updated
// anywhere, but since rawAlpha and beta are updated in stateInput,
// I have them change in state input as well.)
export function normalizeForMe(
  probZero,
  probOne,
  sqrNormalization,
  alphaCurrentVal,
  betaCurrentVal,
  setNormalizedStatus,
  addOrSubt,
) {
  console.time("backend call");
  // call the backend to normalize the state
  const normalizedStateResult = backend.normalizeState(
    probZero,
    probOne,
    sqrNormalization,
    // Make sure to pass it as a structure using
    // what we defined as our members in the c++ backend
    // (re and im). In math.js, complex values get their
    // real and imaginary values through .re and .im properties as well,
    // so the naming was deliberate.
    { re: alphaCurrentVal.re, im: alphaCurrentVal.im },
    { re: betaCurrentVal.re, im: betaCurrentVal.im },
  );
  console.timeEnd("backend call");

  // Check that the returned values are actually usable. Dont update our
  // values if normalizedStateResult is garbage/unusuable for whatever reason.
  // First, make sure normalizedStateResult is not null
  if (normalizedStateResult === null) {
    setNormalizedStatus("error");
    setNormalizationError("Normalization returned null result");
    return;
  }
  // Make sure that alpha struct and beta struct exist
  else if (
    normalizedStateResult.alphaStruct === null ||
    normalizedStateResult.betaStruct === null
  ) {
    setNormalizedStatus("error");
    setNormalizationError("Normalization returned null alpha or beta");
    return;
  }
  // Use for easier reading
  const alResult = normalizedStateResult.alphaStruct;
  const beResult = normalizedStateResult.betaStruct;

  // Make sure that alpha and beta struct have valid real and imaginary numbers that are finite.
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
    // multiply both values by negative 1, essnetially distributing
    // a second negative one to cancel out the first distributed one.
    normalizedStateResult.betaStruct.re *= -1;
    normalizedStateResult.betaStruct.im *= -1;
  }

  setNormalizedStatus("normalized");

  // Return an object containing the new values we need
  return normalizedStateResult;
}
