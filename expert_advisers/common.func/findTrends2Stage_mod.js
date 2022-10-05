// реально работает быстрее, но на одной из итераций (2h/15m) получаем ошибку - TypeError: Cannot read properties of undefined (reading 'id')

// для стратегии: фракталы Билла Вильямса
function findTrends2Stage_mod(candlesJunior, candleSenior, fractal) {
  // фиксируем начало и конец свечки, которая пересекла фрактал
  //const startTimeSenior = candleSenior.startTime
  //const endTimeSenior = candleSenior.endTime + 1

  const startTimeSenior = findIndexInArray(candlesJunior, candleSenior) // получаем id

  let endTimeSenior = candleSenior // копируем объект
  endTimeSenior.startTime = candleSenior.endTime + 1 // перезаписываем правильную дату для поиска
  endTimeSenior = findIndexInArray(candlesJunior, endTimeSenior) // получаем id

  for (let i = startTimeSenior; i <= endTimeSenior; i++) {
    if (fractal.nameFracral == 'Bullish') {
      if (candlesJunior[i].low < fractal.low) {
        return {
          candlesJunior: candlesJunior[i],
          id: i,
        }
      } else return { id: 0 }
    } //if (fractal.nameFracral == 'Bullish')

    if (fractal.nameFracral == 'Bearish') {
      if (candlesJunior[i].high > fractal.high) {
        return {
          candlesJunior: candlesJunior[i],
          id: i,
        }
      } else return { id: 0 }
    } //if (fractal.nameFracral == 'Bullish')
  } // for (let i = 0; i < candlesJunior.length; i++)
}

function findIndexInArray(candlesJunior, candleSenior) {
  // ищем id даты candleSenior в массиве candlesJunior
  // реализация через log(n) - бинарный поиск
  let start = 0 // начальная точка поиска
  let end = candlesJunior.length - 1 // конечная точка поиска

  // если необходимой даты нет в массиве, то возвращаем ошибку
  if (
    candleSenior.startTime < candlesJunior[start].startTime ||
    candleSenior.startTime > candlesJunior[end].startTime
  ) {
    return -1
  }

  while (true) {
    // соответствует ли необходимая дата началу массива
    if (candleSenior.startTime == candlesJunior[start].startTime) {
      return start
    }

    // соответствует ли необходимая дата концу массива
    if (candleSenior.startTime == candlesJunior[end].startTime) {
      return end
    }

    // проверка, есть ли элементы между началом и концом массива
    if (end - start <= 1) {
      return -1
    }

    // разделяем массив пополам
    const middle = Math.floor((start + end) / 2)

    if (candleSenior.startTime > candlesJunior[middle].startTime) {
      start = middle + 1
    } else if (candleSenior.startTime < candlesJunior[middle].startTime) {
      end = middle - 1
    } else {
      return middle
    }
  } // while (true)
}

module.exports = findTrends2Stage_mod
