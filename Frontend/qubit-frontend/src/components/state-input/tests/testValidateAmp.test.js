import { validateAmplitudeInput } from "../validateAmplitudeInput";
import { expect, test } from "vitest";

// test the validate amp input function
/*
1. illegal expression: []
*/
test("returns error 1 for illegal expression", () => {
  // returns an object, so we need to first grab the object
  const resultIllTest1 = validateAmplitudeInput("[]");
  // then check its errorNumber property to see if its 1
  expect(resultIllTest1.errorNumber).toBe(1);
});

/*
2. symbols not allowed: x, cos(x), a
*/
test("returns error 2 for disallowed symbol (variable x)", () => {
  const resultSymTest1 = validateAmplitudeInput("x");
  // Should be err number 2, Disallowed symbol
  expect(resultSymTest1.errorNumber).toBe(2);
});

test("returns error 2 for disallowed symbol (variable a)", () => {
  const resultSymTest2 = validateAmplitudeInput("a");
  // Should be err number 2, Disallowed symbol
  expect(resultSymTest2.errorNumber).toBe(2);
});

test("returns error 2 for disallowed symbol (variable x inside sin())", () => {
  const resultSymTest3 = validateAmplitudeInput("sin(x)");
  // Should be err number 2, Disallowed symbol, not 3 (disallowed function)
  // or 4 (function with wrong number of arguments)
  expect(resultSymTest3.errorNumber).toBe(2);
});

/*
3. disallowed function: arccos(1), setUnion(1)
 */
test("returns error 3 for disallowed function (arccos should be acos)", () => {
  const resultFnDisTest1 = validateAmplitudeInput("arccos(1)");
  // Should be err number 3, Disallowed function because it
  // is spelled wrong. acos is allowed, arccos is not
  expect(resultFnDisTest1.errorNumber).toBe(3);
});

test("returns error 3 for disallowed function (setUnion() is not allowed)", () => {
  const resultFnDisTest2 = validateAmplitudeInput("setUnion(1)");
  // Should be err number 3, Disallowed function.
  // setUnion not allowed in program to prevent errors
  expect(resultFnDisTest2.errorNumber).toBe(3);
});

test("returns error 3 for disallowed function ('is function allowed' is checked before 'is number of arguments allowed')", () => {
  const resultFnDisTest3 = validateAmplitudeInput("arccos(1,2)");
  // Should be err number 4. Too many arguments as well, but function being
  // allowed is checked before function having too many arguments
  expect(resultFnDisTest3.errorNumber).toBe(3);
});

/*
4. function with to many or to little arguments: complex(1, 5, 6), acos(1, 2), sin(1,2,3,4,5,6*1)
*/
test("returns error 4 for function argument error (sin takes one argument)", () => {
  const resultFnArgTest1 = validateAmplitudeInput("sin(1,2,3,4,5,6*1)");
  // Should be err number 4. Function is allowed, just has
  // too many arguments
  expect(resultFnArgTest1.errorNumber).toBe(4);
});

test("returns error 4 for function argument error (acos takes one argument)", () => {
  const resultFnArgTest2 = validateAmplitudeInput("acos(1,2)");
  // Should be err number 4. Function is allowed, just has
  // too many arguments
  expect(resultFnArgTest2.errorNumber).toBe(4);
});

test("returns error 4 for function argument error (complex takes one or two arguments)", () => {
  const resultFnArgTest3 = validateAmplitudeInput("complex(1, 5, 6)");
  // Should be err number 4. Function is allowed, just has
  // too many arguments
  expect(resultFnArgTest3.errorNumber).toBe(4);
});

test("returns error 4 for function argument error (sin takes at least one argument)", () => {
  const resultFnArgTest4 = validateAmplitudeInput("sin()");
  // Should be err number 4. Function is allowed, just has
  // too few arguments
  expect(resultFnArgTest4.errorNumber).toBe(4);
});

/*
5. unfinished expression: 1 *, 4^, cos(, / 2 
*/
test("returns error 5 for incomplete expression (cos needs a full bracket)", () => {
  const resultExpUnTest1 = validateAmplitudeInput("cos(");
  // Should be err number 5. Expression was not
  // written in full
  expect(resultExpUnTest1.errorNumber).toBe(5);
});

test("returns error 5 for incomplete expression (multiplication needs a left and right value)", () => {
  const resultExpUnTest2 = validateAmplitudeInput("1 * ");
  // Should be err number 5. Expression was not
  // written in full
  expect(resultExpUnTest2.errorNumber).toBe(5);
});

test("returns error 5 for incomplete expression (exponentiation needs a left and right value)", () => {
  const resultExpUnTest3 = validateAmplitudeInput("4^");
  // Should be err number 5. Expression was not
  // written in full
  expect(resultExpUnTest3.errorNumber).toBe(5);
});

test("returns error 5 for incomplete expression (division needs a left and right value)", () => {
  const resultExpUnTest4 = validateAmplitudeInput(" / 2");
  // Should be err number 5. Expression was not
  // written in full
  expect(resultExpUnTest4.errorNumber).toBe(5);
});

test("returns error 5 for incomplete expression (double exponentiation resolves to incomplete in math.js)", () => {
  const resultExpUnTest5 = validateAmplitudeInput("1 ** 2");
  // Should be err number 5. Expression was not
  // written in full
  expect(resultExpUnTest5.errorNumber).toBe(5);
});

test("returns error 5 for incomplete expression (every left bracket requires a right bracket)", () => {
  const resultExpUnTest6 = validateAmplitudeInput("(1+2");
  // Should be err number 5. Expression was not
  // written in full
  expect(resultExpUnTest6.errorNumber).toBe(5);
});

test("returns error 5 for incomplete expression (every right bracket requires a left bracket)", () => {
  const resultExpUnTest7 = validateAmplitudeInput("1+2)");
  // Should be err number 5. Expression was not
  // written in full
  expect(resultExpUnTest7.errorNumber).toBe(5);
});

/*
6. No error: values are allowed and should not return an error. Expressions like: 
complex(1), sin(1), 1 + 2, 1 - 2, 1 - 2i, 1 + 2i, 1 / 2.00000001, 15 * 4,
acos(atan(acos(atan(1)))), cos(0) / sin(1), 4^2
 */

test("returns null for valid expression (complex can take one value)", () => {
  const resultAllowedTest1 = validateAmplitudeInput("complex(1)");
  // Should be NULL, as a successful validation should return NULL
  // for no error.
  // Complex interprets one value as there being no imaginary
  // value (bi = 0)
  expect(resultAllowedTest1).toBeNull();
});

test("returns null for valid expression (sin can take one value)", () => {
  const resultAllowedTest2 = validateAmplitudeInput("sin(1)");
  // Should be NULL, as a successful validation should return NULL
  // for no error.
  expect(resultAllowedTest2).toBeNull();
});

test("returns null for valid expression (addition allowed)", () => {
  const resultAllowedTest3 = validateAmplitudeInput("1 + 2");
  // Should be NULL, as a successful validation should return NULL
  // for no error.
  expect(resultAllowedTest3).toBeNull();
});

test("returns null for valid expression (subtraction allowed)", () => {
  const resultAllowedTest4 = validateAmplitudeInput("1 - 2");
  // Should be NULL, as a successful validation should return NULL
  // for no error.
  expect(resultAllowedTest4).toBeNull();
});

test("returns null for valid expression (complex subtraction allowed)", () => {
  const resultAllowedTest5 = validateAmplitudeInput("1 - 2i");
  // Should be NULL, as a successful validation should return NULL
  // for no error.
  expect(resultAllowedTest5).toBeNull();
});

test("returns null for valid expression (complex addition allowed)", () => {
  const resultAllowedTest6 = validateAmplitudeInput("1 + 2i");
  // Should be NULL, as a successful validation should return NULL
  // for no error.
  expect(resultAllowedTest6).toBeNull();
});

test("returns null for valid expression (multiplication allowed)", () => {
  const resultAllowedTest7 = validateAmplitudeInput("15 * 4");
  // Should be NULL, as a successful validation should return NULL
  // for no error.
  expect(resultAllowedTest7).toBeNull();
});

test("returns null for valid expression (deep function calls allowed)", () => {
  const resultAllowedTest8 = validateAmplitudeInput(
    "acos(atan(acos(atan(1))))",
  );
  // Should be NULL, as a successful validation should return NULL
  // for no error.
  expect(resultAllowedTest8).toBeNull();
});

test("returns null for valid expression (function math allowed)", () => {
  const resultAllowedTest9 = validateAmplitudeInput("cos(0) / sin(1)");
  // Should be NULL, as a successful validation should return NULL
  // for no error.
  expect(resultAllowedTest9).toBeNull();
});

test("returns null for valid expression (exponentiation allowed)", () => {
  const resultAllowedTest10 = validateAmplitudeInput("4^2");
  // Should be NULL, as a successful validation should return NULL
  // for no error.
  expect(resultAllowedTest10).toBeNull();
});

test("returns null for valid expression (an empty string should not throw an error)", () => {
  const resultAllowedTest11 = validateAmplitudeInput("");
  // Should be NULL, as a successful validation should return NULL
  // for no error.
  expect(resultAllowedTest11).toBeNull();
});

test("returns null for valid expression (whitespace should not throw an error)", () => {
  const resultAllowedTest12 = validateAmplitudeInput(" ");
  // Should be NULL, as a successful validation should return NULL
  // for no error.
  expect(resultAllowedTest12).toBeNull();
});

test("returns null for valid expression (whitespace around an expression should not throw an error)", () => {
  const resultAllowedTest13 = validateAmplitudeInput(" 1 + 2 ");
  // Should be NULL, as a successful validation should return NULL
  // for no error.
  expect(resultAllowedTest13).toBeNull();
});

test("returns null for valid expression (unary minus is allowed)", () => {
  const resultAllowedTest14 = validateAmplitudeInput("-1");
  // Should be NULL, as a successful validation should return NULL
  // for no error.
  expect(resultAllowedTest14).toBeNull();
});

test("returns null for valid expression (implied negative 1 is allowed)", () => {
  const resultAllowedTest15 = validateAmplitudeInput("-(1+2)");
  // Should be NULL, as a successful validation should return NULL
  // for no error.
  expect(resultAllowedTest15).toBeNull();
});

test("returns null for valid expression (unary minus is allowed in functions)", () => {
  const resultAllowedTest16 = validateAmplitudeInput("sin(-1)");
  // Should be NULL, as a successful validation should return NULL
  // for no error.
  expect(resultAllowedTest16).toBeNull();
});

test("returns null for valid expression (unary plus is allowed)", () => {
  const resultAllowedTest17 = validateAmplitudeInput("1 ++ 2");
  // Should be NULL, as a successful validation should return NULL
  // for no error.
  // 1 ++ 2 is 1 + (+2), and +2 just means positive 2
  expect(resultAllowedTest17).toBeNull();
});

test("returns null for valid expression (complex numbers allowed)", () => {
  const resultAllowedTest18 = validateAmplitudeInput("2i");
  // Should be NULL, as a successful validation should return NULL
  // for no error.
  expect(resultAllowedTest18).toBeNull();
});

test("returns null for valid expression (negative complex numbers allowed)", () => {
  const resultAllowedTest19 = validateAmplitudeInput("-2i");
  // Should be NULL, as a successful validation should return NULL
  // for no error.
  expect(resultAllowedTest19).toBeNull();
});

test("returns null for valid expression (full complex function allowed)", () => {
  const resultAllowedTest20 = validateAmplitudeInput("complex(1,2)");
  // Should be NULL, as a successful validation should return NULL
  // for no error.
  expect(resultAllowedTest20).toBeNull();
});

/*
7. Functionality tests: */

test("Invalid input returns a non null object", () => {
  const resultFunctionalityTest1 = validateAmplitudeInput("sin(");
  // Should be not null
  expect(resultFunctionalityTest1).not.toBeNull();
  // To be of type object
  expect(resultFunctionalityTest1).toBeTypeOf("object");
  // That has property error number that is equal to 5
  expect(resultFunctionalityTest1).toHaveProperty("errorNumber", 5);
});

test("Valid input returns null", () => {
  // Should be NULL
  const resultFunctionalityTest2 = validateAmplitudeInput("sin(1)");
  expect(resultFunctionalityTest2).toBeNull();
});
