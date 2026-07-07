// exists for testing the frontend throughput. Not a vitest file, since vitest doesn't just the experience in browser (aka after compilation).
// Should be called by a test button displayed on screen if needed, but I already did this testing earlier
function testNGates() {
  // check N gates
  // Use the current input, and then grab the input from before and use
  // it next to make it "pseudo random"
  let result = backend.hadamardGate(
    { re: evalAlpha.current.re, im: evalAlpha.current.im },
    { re: evalBeta.current.re, im: evalBeta.current.im },
  );
  let alpha = { re: result.alpha.re, im: result.alpha.im };
  let beta = { re: result.beta.re, im: result.beta.im };

  // make a list of functions
  let gates = {
    0: backend.XGate,
    1: backend.YGate,
    2: backend.ZGate,
    3: backend.hadamardGate,
    4: backend.SGate,
    5: backend.TGate,
  };
  // there are 6 gates, so we have 5 options, 0 through 6
  let randomNum = Math.floor(Math.random() * 6);
  // generate a random sequence of 30 gates, so the loop doesn't check it.
  let sequence = [];
  for (let i = 0; i < 30; i++) {
    sequence.push(gates[randomNum]);
    randomNum = Math.floor(Math.random() * 6);
  }

  let preAlpha = alpha;
  let preBeta = beta;
  // warmup loop for the jit (100 times)
  for (let i = 0; i < 100; i++) {
    result = sequence[i % 30](alpha, beta);
    alpha = { re: result.alpha.re, im: result.alpha.im };
    beta = { re: result.beta.re, im: result.beta.im };
  }

  // now measure it 5 different times
  let allRuns = [];
  for (let j = 0; j < 5; j++) {
    const start = performance.now();
    // try 50000 million gates
    for (let i = 0; i < 50000; i++) {
      // use the current number to choose the randomly applied gates using modulo 30 (avoids
      // having a huge array in memory)
      result = sequence[i % 30](alpha, beta);
      // grab the results in alpha and beta for pseudo random
      alpha = { re: result.alpha.re, im: result.alpha.im };
      beta = { re: result.beta.re, im: result.beta.im };
    }
    const end = performance.now();
    // add this run to the array
    allRuns.push(end - start);
    // reset alpha and beta to avoid getting stuck with small values
    alpha = preAlpha;
    beta = preBeta;
  }
  console.log(allRuns);
  allRuns.sort();
  console.log("time taken for 50000 gates is, on average", allRuns[2], "ms");
}
