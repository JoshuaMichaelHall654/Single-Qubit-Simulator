import backendModule from "../../compiledBackend/backend.out";
import { formatComplex } from "./formatComplex";
import { complex } from "mathjs";

const backend = await backendModule();

export function normalizeForMe(
  probZero,
  probOne,
  sqrNormalization,
  setRawAlpha,
  setRawBeta,
  evalAlpha,
  evalBeta,
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
    { re: evalAlpha.current.re, im: evalAlpha.current.im },
    { re: evalBeta.current.re, im: evalBeta.current.im },
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

  // Get the formatted values for alpha and beta
  const formattedAlpha = formatComplex(
    normalizedStateResult.alphaStruct.re,
    normalizedStateResult.alphaStruct.im,
  );

  // If the user is subtracting by beta, make sure that the
  // negative value of beta is removed (to prevent --, which would be wrong)
  if (addOrSubt === false) {
    // multiply both values by negative 1, essnetially distributing
    // a second negative one to cancel out the first distributed one.
    normalizedStateResult.betaStruct.re *= -1;
    normalizedStateResult.betaStruct.im *= -1;
  }
  const formattedBeta = formatComplex(
    normalizedStateResult.betaStruct.re,
    normalizedStateResult.betaStruct.im,
  );

  // Update eval alpha and beta. Must be done with the returnedStuff, not
  // rawAlpha and beta because async guarantees they are not yet updated
  // by the time the below runs
  evalAlpha.current = complex(
    normalizedStateResult.alphaStruct.re,
    normalizedStateResult.alphaStruct.im,
  );
  evalBeta.current = complex(
    normalizedStateResult.betaStruct.re,
    normalizedStateResult.betaStruct.im,
  );

  setNormalizedStatus("normalized");

  // Return an object containing the new values we need
  return { formattedAlpha, formattedBeta };
}
