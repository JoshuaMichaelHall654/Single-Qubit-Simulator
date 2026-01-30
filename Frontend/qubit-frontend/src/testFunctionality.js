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
