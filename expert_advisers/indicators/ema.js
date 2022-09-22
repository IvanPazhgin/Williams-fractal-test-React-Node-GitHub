// exponential moving average javascript

// второй раз ema вернется как обычный массив, а не объект

// можно рассчитать единожды в первом файле, затем передать во все ТФ
// последнюю функцию уже использовать в классах по каждому ТФ
function emaCalc(mArray, mRange) {
  const k = 2 / (mRange + 1)

  let emaArray = [
    {
      startTime: mArray[0].startTime,
      close: mArray[0].close,
      //mRange: 1,
    },
  ]
  let temp = {}

  // for the rest of the items, they are computed with the previous one
  for (let i = 1; i < mArray.length; i++) {
    temp = {
      startTime: mArray[i].startTime,
      close: mArray[i].close * k + emaArray[i - 1].close * (1 - k),
      //mRange: emaArray[i - 1].mRange + 1,
    }
    emaArray = emaArray.concat(temp)
  }
  //console.log('emaArray: ', emaArray)
  return emaArray
}

/*
// пример из интернета
function emaCalcExamle(mArray, mRange) {
  const k = 2 / (mRange + 1)
  // first item is just the same as the first item in the input
  let emaArray = [mArray[0].close]
  // for the rest of the items, they are computed with the previous one
  for (let i = 1; i < mArray.length; i++) {
    emaArray.push(mArray[i].close * k + emaArray[i - 1] * (1 - k))
  }
  return emaArray
}

// расчёт последней ema
// возможно будет противоречие в том, что повторно прилетает объект с одним элементом. Поэтому проще переделать под один элемент
function emaLastWithArray(emaPrevious, emaArray) {
  const k = 2 / (emaArray[emaArray.length - 1].mRange + 1)
  // возвращать объект
  return {
    startTime: emaArray[emaArray.length - 1].startTime,
    ema: emaArray[emaArray.length - 1].close * k + emaPrevious * (1 - k),
    mRange: emaArray[emaArray.length - 1].mRange + 1,
  }
}

function emaLast(newCandle, mRange, emaPrevious) {
  const k = 2 / (mRange + 1)
  // возвращать объект
  return {
    startTime: newCandle.startTime,
    ema: newCandle.close * k + emaPrevious * (1 - k),
    //mRange: emaArray[emaArray.length - 1].mRange + 1,
  }
}
*/

module.exports = emaCalc
