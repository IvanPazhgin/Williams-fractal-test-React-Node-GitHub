const timestampToDateHuman = require('../common.func/timestampToDateHuman')

// расшифровка аббривиатуры: fractal Bullish For Williams Test
// Bullish (бычий) Fractal для теста стратегии Билла Вильясма на скаченных свечках.
// идея в том, что в момент начала тренда, на младшнем ТФ мы ищем последний фрактал и точку входа
function fractal_Bullish_for_Test(array, start, finish) {
  let fractal_Bullish = {
    isFractal: false,
    low: 0,
    time: 0,
  }

  for (let i = start; i <= finish; i++) {
    // ищем Bullish (бычий) Fractal. Факртал находится на позиции [i-2]
    if (
      array[i - 4].low > array[i - 2].low &&
      array[i - 3].low > array[i - 2].low &&
      array[i - 1].low > array[i - 2].low &&
      array[i].low > array[i - 2].low
    ) {
      fractal_Bullish = {
        nameFracral: 'Bullish',
        nameFracralRus: 'Бычий фрактал',
        isFractal: true,
        low: array[i - 2].low,
        time: array[i - 2].startTime,
        // проверочная ифнормация
        timeHuman: timestampToDateHuman(array[i - 2].startTime),
        //i: finish,
        //iH: timestampToDateHuman(array[i].startTime),
      }
      return fractal_Bullish
    } else return fractal_Bullish
  }
}

module.exports = fractal_Bullish_for_Test
