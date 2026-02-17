// A helper function to format complex values as strings.
// Expects finite numbers.
export function formatComplex(real, imag) {
  if (!Number.isFinite(real) || !Number.isFinite(imag)) {
    return "Error in formatting. NaN or infinity";
  }
  // If the imaginary values dont exist, just return real, no need to care about positive or negative
  if (imag === 0) {
    return "" + real;
  }
  // If the imaginary value exists but real is exactly zero, do not include it, and instead format it
  // as a singular expression (i.e. "-x" instead of "y - x")
  else if (real === 0) {
    console.log("test");
    return (imag > 0 ? "" : "-") + Math.abs(imag) + "i";
  }

  // If the imaginary value exists, return it included. If its greater than 0, have
  // a plus sign. Otherwise, have a minus sign. Get the abs value of imag to avoid double
  // negatives.
  else {
    return real + (imag > 0 ? " + " : " - ") + Math.abs(imag) + "i";
  }
}
