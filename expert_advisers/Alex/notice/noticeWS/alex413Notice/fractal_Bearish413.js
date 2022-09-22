const timestampToDateHuman = require('../../../../common.func/timestampToDateHuman')

function fractal_Bearish413(array) {
  let fractal_Bearish = {
    isFractal: false,
    high: 0,
    time: 0,
  }

  //for (let i = start; i <= finish; i++) {
  // ищем Bearish (медвежий) Fractal. Факртал находится на позиции [i-2]
  if (
    array[4].high < array[6].high &&
    array[5].high < array[6].high &&
    array[7].high < array[6].high &&
    array[8].high < array[6].high
  ) {
    fractal_Bearish = {
      nameFracral: 'Bearish',
      nameFracralRus: 'Медвежий фрактал',
      isFractal: true,
      high: array[6].high,
      time: array[6].startTime,
      // проверочная ифнормация
      timeHuman: timestampToDateHuman(array[6].startTime),
      //i: finish,
      iH: timestampToDateHuman(array[8].startTime),
    }
    return fractal_Bearish
  } else return fractal_Bearish
  //}
}

module.exports = fractal_Bearish413
