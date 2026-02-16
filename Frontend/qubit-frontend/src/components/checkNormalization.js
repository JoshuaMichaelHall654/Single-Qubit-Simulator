import { multiply, parse, conj, re } from "mathjs";
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
  console.log(alphaConjugate);
  // aa* is always real and non negative, so you should ignore any imaginary
  // parts in your final answer, as those are likely floating point errors.
  // Note, this does not mean you should not compute aa* fully, as you will
  // get the wrong answer if you ignore the complex part of the multiplication.
  // Must multiply using the multiply function instead of * because mathjs does not
  // overload * for complex multiplication. Use re() because
  // non complex numbers do not have a .re, but re() always returns
  // a sensible number
  const alphaMagSq = re(multiply(alpha, alphaConjugate));
  console.log(alphaMagSq);

  // Do the same thing for beta
  const betaConjugate = conj(beta);
  const betaMagSq = re(multiply(beta, betaConjugate));

  // Now, check if they both add to one. First, save it as our normalization
  // squared value to use it later. N^2 = |a|^2 + |b|^2
  const sqrNormalization = alphaMagSq + betaMagSq;

  // Return our values. App.jsx will check for normalization since its trivial
  return createResults(sqrNormalization, alphaMagSq, betaMagSq);
}
