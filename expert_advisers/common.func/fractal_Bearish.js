const timestampToDateHuman = require('./timestampToDateHuman')

function fractal_Bearish(array) {
  let fractal_Bearish = {
    isFractal: false,
    high: 0,
    time: 0,
  }

  //for (let i = start; i <= finish; i++) {
  // ищем Bearish (медвежий) Fractal. Факртал находится на позиции [i-2]
  if (
    array[0].high < array[2].high &&
    array[1].high < array[2].high &&
    array[3].high < array[2].high &&
    array[4].high < array[2].high
  ) {
    fractal_Bearish = {
      nameFracral: 'Bearish',
      nameFracralRus: 'Медвежий фрактал',
      isFractal: true,
      high: array[2].high,
      time: array[2].startTime,
      // проверочная ифнормация
      timeH: timestampToDateHuman(array[2].startTime),
      //i: finish,
      iH: timestampToDateHuman(array[4].startTime),
    }
    return fractal_Bearish
  } else return fractal_Bearish
  //}
}

module.exports = fractal_Bearish
