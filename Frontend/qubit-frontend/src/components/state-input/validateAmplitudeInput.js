import { parse } from "mathjs";
import {} from "../../App";
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
  "nthRoot",
  "exp",
  "log",
  "pow",
  "abs",
  "arg",
  "conj",
  "re",
  "im",
  "complex",
];

// Create a list of functions that are allowed both 1 or 2 arguments
let oneOrTwoArgs = ["pow", "log", "complex", "nthRoot"];

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

// Checks if the inputed value is a valid number/function.
// Valid items include: trig functions, i, numbers, maybe other stuff
export function validateAmplitudeInput(input) {
  const createError = (errorNumber, name) => ({
    errorNumber: errorNumber,
    name: name,
  });

  const STOP = Symbol("STOP_TRAVERSAL");
  let validationError = createError(0, "");

  // If the value is empty, return no error which is null
  if (input.trim() === "") {
    return null;
  }

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
          // throw an error to stop the function completely
          throw STOP;
        }

        // If a node type that is not allowed is included, give the user an
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

          // The number of args is 1 for all functions not on the oneOrTwoArgs list. Those can be 1 or 2.
          let correctNumArgs = false;
          if (oneOrTwoArgs.includes(node.name)) {
            correctNumArgs = numArgs === 1 || numArgs === 2;
          } else {
            correctNumArgs = numArgs === 1;
          }

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

        // Otherwise do nothing, all other nodes are fine.
      });
    } catch (e) {
      // Catch and stop completely if stop was thrown. All other errors go to the second catch
      if (e !== STOP) {
        throw e;
      } else {
        return validationError;
      }
    }
  } catch (e) {
    // If the traversal throws an error, the user likely hasn't finished typing their expression yet.
    // console.log(e);
    // Remove unfinished expression detected if it feels bad in the UX
    // set error number to 5 and make add an empty name that will go unusued (but is not an empty string)
    validationError = createError(5, "deliberately not empty");
    return validationError;
  }

  // return null for no error
  return null;
}
