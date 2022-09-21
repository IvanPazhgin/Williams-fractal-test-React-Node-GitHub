// exponential moving average javascript

function emaCalc(mArray, mRange) {
  const k = 2 / (mRange + 1)
  // first item is just the same as the first item in the input
  let emaArray = [mArray[0].close]
  // for the rest of the items, they are computed with the previous one
  for (let i = 1; i < mArray.length; i++) {
    emaArray.push(mArray[i] * k + emaArray[i - 1] * (1 - k))
  }
  return emaArray
}

module.exports = emaCalc
