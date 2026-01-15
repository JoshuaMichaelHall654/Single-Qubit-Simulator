import { multiply, parse, conj, re } from "mathjs";
import {} from "./App";

// Create a list of allowed functions. Math.parse evalutes many functions as symbols AND
// functions, so we need to carefully choose which symbols to exclude (i.e. variables) and
// which to include (i.e. trig functions).
let allowedFunctions = [
  "cos",
  "sin",
  "tan",
  "cot",
  "sec",
  "csc",
  "asin",
  "acos",
  "atan",
  "sqrt",
  "acot",
  "asec",
  "acsc",
  "sinh",
  "cosh",
  "tanh",
  "asinh",
  "acosh",
  "atanh",
  "exp",
  "log",
  "abs",
  "arg",
  "conj",
  "re",
  "im",
  "complex",
];

// The list of allowed symbols. If a symbol is not a function child or one of these, its disallowed.
let allowedSymbols = [
  "pi",
  "PI",
  "i",
  "e",
  "E",
  "tau",
  "phi",
  "SQRT1_2",
  "SQRT2",
];

// Additionally, some node types for math.parse should not be allowed as well, such as
// matricies, Conditional Nodes, etc. Symbol node is also included, but with some conditions
let allowedNodes = [
  "ParenthesisNode",
  "OperatorNode",
  "ConstantNode",
  "FunctionNode",
  "SymbolNode",
];

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

  // Now, check if they both add to one. First, save it as our normalization
  // squared value to use it later. N^2 = |a|^2 + |b|^2
  const sqrNormalization = alphaMagSq + betaMagSq;

  // Return our values. App.jsx will check for normalization since its trivial
  return createResults(sqrNormalization, alphaMagSq, betaMagSq);
}

// Checks if the inputed value is a valid number/function.
// Valid items include: trig functions, i, numbers, maybe other stuff
export function validateInput(input) {
  const createError = (errorNumber, name) => ({
    errorNumber: errorNumber,
    name: name,
  });
  const STOP = Symbol("STOP_TRAVERSAL");
  let validationError = createError(0, "");

  // Idea for validation: parse expression, traverse it for illegal values, if no illegal values, evaluate it,
  // then finally normalize it once user hasnt typed for ~100ms.
  // Parse gives info on when expression is incomplete by throwing a syntax error, allowing you to
  // end early. If illegal values, give detailed error message (i.e. variables not allowed. Variable detected: x).
  try {
    try {
      const node = parse(input);

      // Traverse the tree to find any illegal expressions.
      node.traverse(function (node, path, parent) {
        // If there is a validation error already in place, return early
        if (validationError.errorNumber !== 0) {
          console.log("test");
          // throw an error to stop the function completely
          throw STOP;
        }

        // If the node type that is not allowed included, give the user an
        // error message about it being not included
        if (!allowedNodes.includes(node.type)) {
          // Set error number to 1 (illegal node type) and make name the node name
          validationError = createError(1, node.toString());
          throw STOP;
        }

        // We want to remove any variables/symbols, so check if the node type is a SymbolNode
        else if (node.type === "SymbolNode") {
          // Check if the parent of the symbol is a function. If it is, and this is the function identifer
          // node (found by checking the path) its allowed.
          // All of that being true means this specific symbol is an identifier to
          // a function that is allowed and working. Check if the parent exists before checking its type.

          if (parent && parent.type === "FunctionNode" && path === "fn") {
            // Go to the next node with return
            return;
          }

          // If the symbol is on the allowed symbol list (not allowed function list), allow it regardless.
          else if (allowedSymbols.includes(node.name)) {
            return;
          }

          // You can probably turn this into a single if statement since the above two just return if false,
          // but I cant figure out how to do it while keeping the logic clear, so leave it for now.
          else {
            // Set error number to 2 and add node.name
            validationError = createError(2, node.toString());
            throw STOP;
          }
        }

        // Need to verify that the function is not empty and is allowed.
        else if (node.type === "FunctionNode") {
          const numArgs = Array.isArray(node.args) ? node.args.length : 0;

          // The number of args is 1 for all functions besides complex, which can be 1 or 2.
          const correctNumArgs =
            (node.name === "complex" && (numArgs === 1 || numArgs === 2)) ||
            (node.name !== "complex" && numArgs === 1);

          // Check that its on the list of allowed variables
          if (!allowedFunctions.includes(node.name)) {
            // set error number to 3 and add node.name
            validationError = createError(3, node.name);
            throw STOP;
          }

          // Check that there is the correct number of arguments using correctNumArgs. This allows (sin(45)) but dissallows ((sin())).
          else if (correctNumArgs === false) {
            // set error number to 4 and add node.name
            validationError = createError(4, node.name);
            throw STOP;
          }
        }

        //Otherwise do nothing, all other nodes are fine.
      });
    } catch (e) {
      // Catch and stop completely if stop was thrown. All other errors go to the second catch
      if (e !== STOP) throw e;
    }
  } catch (e) {
    // If the traversal throws an error, the user likely hasn't finished typing their expression yet.
    //console.log(e);
    // Remove unfinished expression detected if it feels bad in the UX
    // set error number to 5 and make add an empty name that will go unusued (but is not an empty string)
    validationError = createError(5, "deliberately not empty");
  }
  return validationError;
}
