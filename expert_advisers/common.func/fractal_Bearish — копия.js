const timestampToDateHuman = require('./timestampToDateHuman')

function fractal_Bearish(array, start, finish) {
  let fractal_Bearish = {
    isFractal: false,
    high: 0,
    time: 0,
  }
  console.table(array)
  console.log(`start = ${start}, finish = ${finish}`)
  for (let i = start; i <= finish; i++) {
    // ищем Bearish (медвежий) Fractal. Факртал находится на позиции [i-2]
    if (
      array[i - 4].high < array[i - 2].high &&
      array[i - 3].high < array[i - 2].high &&
      array[i - 1].high < array[i - 2].high &&
      array[i].high < array[i - 2].high
    ) {
      fractal_Bearish = {
        nameFracral: 'Bearish',
        nameFracralRus: 'Меджвежий фрактал',
        isFractal: true,
        high: array[i - 2].high,
        time: array[i - 2].startTime,
        // проверочная ифнормация
        timeH: timestampToDateHuman(array[i - 2].startTime),
        i: finish,
        iH: timestampToDateHuman(array[i].startTime),
      }
      return fractal_Bearish
    } else return fractal_Bearish
  }
}

module.exports = fractal_Bearish
