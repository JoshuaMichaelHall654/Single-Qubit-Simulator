// test the validate input function
function testValidateFunction() {
  /*
1, illegal expression: []
2, symbols not allowed: x, cos(x), a
3, disallowed function: arccos(1), setUnion()
4, function with too many or too little argumens: complex(1, 5, 6), acos(1, 2), sin(1,2,3,4,5,6*1)
5, unfinished expression: 1 *, 4^, cos(, / 2 
*/
}

function testNormalizationCheck() {
  const THRESHOLD_MS = 0.1;

  const t0 = performance.now();
  // Should return be false:
  const test = complex(0.6001, 0);
  const test1 = complex(0.7999, 0);
  const dt = performance.now() - t0;

  if (dt > THRESHOLD_MS) {
    console.log(`validateInput took ${dt.toFixed(3)} ms`);
  }
}
