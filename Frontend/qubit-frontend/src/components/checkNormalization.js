import { multiply, conj, re, evaluate, complex, equal, abs } from "mathjs";
import {} from "../App";

// For normalization check to be reactive, it should be on the frontend.
// The time to get a response from the backend would be too long and
// feel sluggish to the user.
// Every state must be normalized in order to properly measure it.
// This method checks if the state is normalized. We return
// true or false.
// Currently, alpha must be the amplitude of state |0>
// and beta must be the amplitude of state |1>. This can be changed
// be removing or redoing the probZero and probOne declarations below.
export function checkNormalizationHelper(alpha, beta) {
  // Make an object to hold the values we want to save
  const createResults = (sqrNorm, alphaProb, betaProb) => ({
    sqrNorm: sqrNorm,
    alphaProb: alphaProb,
    betaProb: betaProb,
  });

  // The state is normalized if |a|^2 and |b|^2 both add to 1.
  // We can know that |a|^2 = aa*, and you can calculate that faster than
  // sqrt(b+ci)^2.
  // Get the complex conjugate of alpha, which is just alpha with the imaginary part
  // * -1. Use math.conj instead of doing it by hand because math.conj
  // works with non complex numbers fine (doing complex (re, im * -1) will fail on non complex values)
  const alphaConjugate = conj(alpha);

  // aa* is always real and non negative, so you should ignore any imaginary
  // parts in your final answer, as those are likely floating point errors.
  // Note, this does not mean you should not compute aa* fully, as you will
  // get the wrong answer if you ignore the complex part of the multiplication.
  // Must multiply using the multiply function instead of * because mathjs does not
  // overload * for complex multiplication. Use re() because
  // non complex numbers do not have a .re, but re() always returns
  // a sensible number
  const alphaMagSq = re(multiply(alpha, alphaConjugate));

  // Do the same thing for beta
  const betaConjugate = conj(beta);
  const betaMagSq = re(multiply(beta, betaConjugate));

  // Save our normalization
  // squared value to use later. N^2 = |a|^2 + |b|^2
  const sqrNormalization = alphaMagSq + betaMagSq;

  // Return our values to the other function
  return createResults(sqrNormalization, alphaMagSq, betaMagSq);
}

// A function that checks the normalization and updates
// values related to normalization and probabilities
export function checkNormalization(rawAlpha, rawBeta, addOrSubt) {
  // In here is what we want to happen after typing stops.

  const checkResult = (
    resultOfCheck,
    alphaNum,
    betaNum,
    sqrNorm,
    alphaProb,
    betaProb,
  ) => ({
    resultOfCheck: resultOfCheck,
    alphaNum: alphaNum,
    betaNum: betaNum,
    sqrNorm: sqrNorm,
    alphaProb: alphaProb,
    betaProb: betaProb,
  });

  // Create alphaNum and betaNum, which serve as proxies for
  // evalAlpha and evalBeta. not references, but
  // standard doubles here. Will be returned to the evalAlpha and
  // evalBeta in the stateinput card.
  let alphaNum = 0.0;
  let betaNum = 0.0;

  // First, evaluate the raw values. We can do it now because
  // this code will hopefully run way less than rawAlpha and Beta
  // will change (which evaluating on every change to values
  // would be very expensive).
  try {
    alphaNum = evaluate(rawAlpha);
    betaNum = evaluate(rawBeta);
  } catch (e) {
    // If we recieve an error from evaluate, return early
    // with our normalization error message
    return checkResult(e.toString(), null, null, null, null, null);
  }
  // Complex will convert them to complex values whether they are real or complex.
  alphaNum = complex(alphaNum);
  betaNum = complex(betaNum);

  // If the user is subtracting by beta, multiply beta by negative one
  if (addOrSubt === false) {
    betaNum = multiply(betaNum, -1);
  }

  // If alpha and beta both evaluate to zero, use render input to throw an
  // error and return to end early
  if (equal(alphaNum, 0) && equal(betaNum, 0)) {
    return checkResult("zero error", null, null, null, null, null);
  }

  console.time("checkNorm");
  const result = checkNormalizationHelper(alphaNum, betaNum);
  console.timeEnd("checkNorm");

  // Finally, check if it equals 1 with epsillon comparison to avoid floating
  // point errors causing a false negative. Using 10^-11 as epsilon for now.
  if (abs(result.sqrNorm - 1) < 0.00000000001) {
    return checkResult(
      "normalized",
      alphaNum,
      betaNum,
      result.sqrNorm,
      result.alphaProb,
      result.betaProb,
    );
  }

  // Otherwise its false
  else {
    return checkResult(
      "not normalized",
      alphaNum,
      betaNum,
      result.sqrNorm,
      result.alphaProb,
      result.betaProb,
    );
  }
}
