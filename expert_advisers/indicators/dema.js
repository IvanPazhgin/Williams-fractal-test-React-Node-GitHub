const emaCalc = require('./ema')

function demaCalc(mArray, mRange) {
  let ema = emaCalc(mArray, mRange)
  //console.table(ema)

  let dema = []

  // конфликт: в emaCalc() в первом случае передается массив, а во втором - элемент массива
  // решение: предварительно повторно прогнать ema
  // решение лучше: добавлять к объекту 4 поле: dema
  let ema2 = emaCalc(ema, mRange)
  //console.table(ema2)

  for (let i = 0; i < ema.length; i++) {
    //dema[i] = 2 * ema[i] - emaCalc(ema[i], mRange)
    dema[i] = 2 * ema[i].close - ema2[i].close
  }
  //console.log('dema Array: ', dema)

  // возвращаем последние значения
  return {
    ema: ema[ema.length - 1].close,
    dema: dema[dema.length - 1],
  }
}

module.exports = demaCalc
