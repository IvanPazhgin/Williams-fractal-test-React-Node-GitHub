const timestampToDateHuman = require('../common.func/timestampToDateHuman')

// расшифровка аббривиатуры: fractal Bearish For Williams Test
// Bearish (медвежий) Fractal для теста стратегии Билла Вильясма на скаченных свечках.
// идея в том, что в момент начала тренда, на младшнем ТФ мы ищем последний фрактал и точку входа
function fractal_Bearish_for_Test(array, start, finish) {
  let fractal_Bearish = {
    isFractal: false,
    high: 0,
    time: 0,
  }

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
        nameFracralRus: 'Медвежий фрактал',
        isFractal: true,
        high: array[i - 2].high,
        time: array[i - 2].startTime,
        // проверочная ифнормация
        timeHuman: timestampToDateHuman(array[i - 2].startTime),
        //i: finish,
        //iH: timestampToDateHuman(array[4].startTime),
      }
      return fractal_Bearish
    } else return fractal_Bearish
  }
}

module.exports = fractal_Bearish_for_Test
