const { USDMClient } = require('binance')

const API_KEY = ''
const API_SECRET = ''

const client = new USDMClient({
  api_key: API_KEY,
  api_secret: API_SECRET,
})

const limitSeniorTrend = 1000
const limitInTrend = 1000

// startProgram2() // запуск через асинхронные функции

//module.exports = startProgram2
module.exports = { startProgram2, findTrends, diffCandle }

async function startProgram2(
  symbol,
  seniorTimeFrame,
  lowerTimeFrame,
  dateStart,
  dateFinish,
  deposit,
  partOfDeposit,
  multiplier
) {
  const startProgramAt = new Date().getTime() // для расчета времени работы приложения
  const delay = (ms) => {
    return new Promise((response) => setTimeout(() => response(), ms))
  }

  const arrayOf1kPeriod = diffCandle(dateStart, dateFinish, seniorTimeFrame)
  let candlesSeniorFull = []

  try {
    for (let i = 0; i < arrayOf1kPeriod.length; i++) {
      const candlesSenior = await client.getKlines({
        symbol: symbol,
        interval: seniorTimeFrame,
        startTime: arrayOf1kPeriod[i].dateFirst,
        endTime: arrayOf1kPeriod[i].dateSecond,
        limit: limitSeniorTrend,
      })
      candlesSeniorFull = candlesSeniorFull.concat(candlesSenior)
    }

    const objectSenior = candlesToObject(candlesSeniorFull)
    //const [trends, startOfTrend] = findTrends(objectSenior)
    const trends = findTrends(objectSenior)
    const [
      allDeals,
      maxOfTrend,
      statInTredn,
      allDeals2,
      depositTemp, // итоговый депозит после трейдинга на исторических данных
      allDealsReal,
      allDealsReal2,
    ] = await getTrendsAsync(
      trends,
      symbol,
      lowerTimeFrame,
      dateFinish,
      deposit,
      partOfDeposit,
      multiplier
    )
    // await delay(5000)
    const statistics = printGlobalProfit(
      allDeals,
      arrayOf1kPeriod,
      maxOfTrend,
      statInTredn,
      startProgramAt,
      symbol,
      seniorTimeFrame,
      lowerTimeFrame,
      deposit,
      allDealsReal
    )
    // вернуть все данные на фронт
    const startProgramAtToHuman = timestampToDateHuman(startProgramAt)
    //statistics = statistics.concat(timestampToDateHuman(startProgramAt))
    //statistics.push(timestampToDateHuman(startProgramAt))
    return {
      allDeals, // выгружаю таблицу всех сделок
      allDeals2, // выгружаю таблицу всех сделок внутри трендов
      allDealsReal, // выгружаю таблицу всех сделок с учетом: депозита, % его использования и плеча
      allDealsReal2,
      statInTredn, // выгружаю статистику по трендам
      startProgramAtToHuman, // начало запуска скрипта
      trends, // список отфильтрованных трендов
      statistics, // итоговая статистика
      // depositTemp, // итоговый депозит после трейдинга на исторических данных
    }
  } catch (err) {
    console.error('getAccountTradeList error: ', err)
  }
}

function diffCandle(date1, date2, timeFrame) {
  // const timeFrame = '1h'
  let dateFirst = Date.parse(date1) // первая дата partOfTimeFrame
  let dateSecond = Date.parse(date2) // вторая дата partOfTimeFrame
  let dateMiddle = new Date()
  const diffday = dateSecond - dateFirst
  let countOfCandles = 0 // кол-во свечей внутри запрос пользователя
  let needTimeFrame = 0 // кол-во массивов по 1000 свечей

  let partOfTimeFrame = [] // массив временных периодов между needTimeFrame
  //let dateSecond = new Date() // вторая дата partOfTimeFrame

  let shiftTime = 0 // свдиг времени для разбивки большого массива по циклам
  let shiftOndeCandle = 0 // сдвиг времени на 1 бар
  const lengthOfPart = 1000 // кол-во свечей в каждой части

  const hour = diffday / 1000 / 60 / 60
  //console.log(`разница между датами составляет ${hour} часов (${hour / 24} дней)`)

  switch (timeFrame) {
    case '1d':
      console.log('1d свечи')
      countOfCandles = diffday / 1000 / 60 / 60 / 24
      shiftOndeCandle = 24 * 60 * 60 * 1000
      shiftTime = shiftOndeCandle * lengthOfPart
      break
    case '12h':
      console.log('12h свечи')
      countOfCandles = diffday / 1000 / 60 / 60 / 12
      shiftOndeCandle = 12 * 60 * 60 * 1000
      shiftTime = shiftOndeCandle * lengthOfPart
      break
    case '8h':
      console.log('8h свечи')
      countOfCandles = diffday / 1000 / 60 / 60 / 8
      shiftOndeCandle = 8 * 60 * 60 * 1000
      shiftTime = shiftOndeCandle * lengthOfPart
      break
    case '6h':
      console.log('6h свечи')
      countOfCandles = diffday / 1000 / 60 / 60 / 6
      shiftOndeCandle = 6 * 60 * 60 * 1000
      shiftTime = shiftOndeCandle * lengthOfPart
      break
    case '4h':
      console.log('4h свечи')
      countOfCandles = diffday / 1000 / 60 / 60 / 4
      shiftOndeCandle = 4 * 60 * 60 * 1000
      shiftTime = shiftOndeCandle * lengthOfPart
      break
    case '2h':
      console.log('2h свечи')
      countOfCandles = diffday / 1000 / 60 / 60 / 2
      shiftOndeCandle = 2 * 60 * 60 * 1000
      shiftTime = shiftOndeCandle * lengthOfPart
      break
    case '1h':
      console.log('1h свечи')
      countOfCandles = diffday / 1000 / 60 / 60
      shiftOndeCandle = 60 * 60 * 1000
      shiftTime = shiftOndeCandle * lengthOfPart
      break
    case '30m':
      console.log('30m свечи')
      countOfCandles = diffday / 1000 / 60 / 30
      shiftOndeCandle = 60 * 30 * 1000
      shiftTime = shiftOndeCandle * lengthOfPart
      break
    case '15m':
      console.log('15m свечи')
      countOfCandles = diffday / 1000 / 60 / 15
      shiftOndeCandle = 60 * 15 * 1000
      shiftTime = shiftOndeCandle * lengthOfPart
      //shiftTime = Date.parse(date1) + lengthOfPart * 60 * 15 * 1000
      break
    case '5m':
      console.log('5m свечи')
      countOfCandles = diffday / 1000 / 60 / 5
      shiftOndeCandle = 60 * 5 * 1000
      shiftTime = shiftOndeCandle * lengthOfPart
      break
    default:
      console.log('нет таких свечей')
  }
  console.log(`кол-во свечей = ${countOfCandles}`)
  //console.log(`сдвиг времени = ${timestampToDateHuman(shiftTime)}`)

  if (countOfCandles <= 1000) {
    partOfTimeFrame[0] = {
      //dateFirst: timestampToDateHuman(dateFirst),
      //dateSecond: timestampToDateHuman(dateSecond),
      dateFirst: dateFirst,
      dateSecond: dateSecond,
    }
  } else {
    needTimeFrame = Math.ceil(countOfCandles / 1000)
    console.log(`кол-во периодов = ${needTimeFrame}`)
    for (let i = 0; i < needTimeFrame; i++) {
      if (i == needTimeFrame - 1) {
        partOfTimeFrame[i] = {
          //dateFirst: timestampToDateHuman(dateFirst),
          //dateSecond: timestampToDateHuman(dateSecond),
          dateFirst: dateFirst,
          dateSecond: dateSecond,
        }
        // partOfTimeFrame[i] = [timestampToDateHuman(dateFirst),timestampToDateHuman(dateSecond)]
        // partOfTimeFrame[i] = [dateFirst, dateSecond]
        // console.log(`длина [${i}] периода = ${(dateSecond - dateFirst) / 60 / 60 / 1000}`)
        //break
      } else {
        dateMiddle = dateFirst + shiftTime
        // partOfTimeFrame[i] = [dateFirst, dateMiddle]
        partOfTimeFrame[i] = {
          //dateFirst: timestampToDateHuman(dateFirst),
          //dateSecond: timestampToDateHuman(dateMiddle),
          dateFirst: dateFirst,
          dateSecond: dateMiddle,
        }
        // partOfTimeFrame[i] = [timestampToDateHuman(dateFirst), timestampToDateHuman(dateMiddle)]
        // console.log(`длина [${i}] периода = ${(dateMiddle - dateFirst) / 60 / 60 / 1000}`)
        dateFirst = dateMiddle + shiftOndeCandle
      }
    }
  }
  console.table(partOfTimeFrame)
  return partOfTimeFrame
}

function usdmBalance() {
  client
    .getBalance()
    .then((result) => {
      // console.log("getBalance result: ", result);
      console.log('getBalance result: ')
      console.table(result)
    })
    .catch((err) => {
      console.error('getBalance error: ', err)
    })
}

function candlesToObject(arg) {
  let target = []
  arg.forEach(function (item, i, arg) {
    target[i] = {
      openTime: item[0],
      // openTimeH: timestampToDateHuman(item[0]),
      openPrice: Number(item[1]),
      highPrice: Number(item[2]),
      lowPrice: Number(item[3]),
      closePrice: Number(item[4]),
    }
  })
  return target
}

function timestampToDateHuman(arg) {
  let bbb = new Date(arg)
  const year = bbb.getFullYear()
  const month = bbb.getMonth() + 1
  const date = bbb.getDate()
  // const hours = bbb.getHours()
  // const minutes = bbb.getMinutes()

  let hours = String(bbb.getHours())
  let minutes = String(bbb.getMinutes())
  if (hours.length == 1) {
    hours = '0' + hours
  }
  if (minutes.length == 1) {
    minutes = '0' + minutes
  }

  return `${year}.${month}.${date} at ${hours}:${minutes}`
}

function printGlobalProfit(
  deals,
  arrayOf1kPeriod,
  maxOfTrend,
  statInTredn,
  startProgramAt,
  symbol,
  seniorTimeFrame,
  lowerTimeFrame,
  deposit,
  allDealsReal
) {
  console.log('')
  console.log(`ОБЩАЯ СТАТИСТИКА:`)
  console.log(
    `symbol = ${symbol} | старший ТФ = ${seniorTimeFrame} | младший ТФ = ${lowerTimeFrame}`
  )
  console.log(
    `Общее кол-во сделок = ${allDealsReal.length} шт (длина передаваемого массива deals)`
  )

  // вычисление прибыли по передаваемому массиву deals
  /*
  let sum = 0
  deals.forEach(function (item) {
    if (typeof item.profit == 'number')
      if (item.profit != '') {
        sum += item.profit
      }
  })
  console.log(`итоговая прибыль = ${+sum.toFixed(2)} USD (проверка по передаваемому deals)`)
  */

  const resultOfDeposit = allDealsReal[allDealsReal.length - 1].deposit
  const profit = resultOfDeposit - deposit
  const roi = (profit / deposit) * 100
  console.log(`Итого на счете = ${resultOfDeposit} USD (real trade)`)
  console.log(
    `Итоговая прибыль/убыток = ${+profit.toFixed(2)} USD (real trade)`
  )
  console.log(`ROI = ${+roi.toFixed(2)}% (real trade)`)

  // const deposit = deals[0].openPrice // как будто депозит равен цене первого хая из массива трендов
  // const roi = (sum / deposit) * 100
  // console.log(`ROI = ${+roi.toFixed(2)}%`)

  //const currentTime = new Date().getTime() // текущая дата
  const startOfTrend = arrayOf1kPeriod[0].dateFirst
  const endOfTrend = arrayOf1kPeriod[arrayOf1kPeriod.length - 1].dateSecond
  const diffInTime = endOfTrend - startOfTrend // Calculating the time difference between two dates
  const oneDay = 1000 * 60 * 60 * 24 // One day in milliseconds
  const diffInDays = Math.round(diffInTime / oneDay) // Calculating the no. of days between two dates
  console.log(`общее кол-во дней торговли = ${diffInDays}`)

  const roiPerYear = (365 * roi) / diffInDays
  console.log(`годовая доходность была бы: ${+roiPerYear.toFixed(2)}%`)

  // поиск максимальной просадки
  let drawdown = []
  allDealsReal.forEach(function (item) {
    drawdown.push(item.profit)
  })
  let min = Math.min.apply(null, drawdown)
  console.log(
    `Максимальная просадка = ${min} USD (${
      Math.round((min / resultOfDeposit) * 10000) / 100
    } %)`
  )
  const multiplierMayBe = -Math.ceil(resultOfDeposit / min) // расчет потенциального плеча

  console.log(`максимальное кол-во свечей в младшем ТФ = ${maxOfTrend} штук`)

  // сортировка массива со сделками - важная функция
  // dealsKostil.sort((a, b) => a.openTimestamp - b.openTimestamp)

  // console.log('')
  // console.log('Все сделки (вывод deals):')
  // console.table(deals)

  console.log('')
  console.log('Все сделки (вывод allDealsReal):')
  console.table(allDealsReal)

  // статистика по сделкам
  let countOfPositive = 0
  let countOfNegative = 0
  let countOfZero = 0
  allDealsReal.forEach(function (item) {
    if (item.profit > 0) {
      countOfPositive++
    } else if (item.profit < 0) {
      countOfNegative++
    } else countOfZero++
  })
  console.log('')
  console.log(`кол-во положительных сделок = ${countOfPositive}`)
  console.log(`кол-во отрицательных сделок = ${countOfNegative}`)
  console.log(`кол-во нулевых сделок = ${countOfZero}`)
  console.log(
    `всего сделок = ${countOfPositive + countOfNegative + countOfZero}`
  )

  // статистика сделок по трендам
  // statInTredn.sort((a, b) => a.indexOfTrend - b.indexOfTrend)
  console.log('')
  console.log('статистика сделок по трендам:')
  console.table(statInTredn)

  // дополнительная проверка прибыли при наличии депозита не работает
  /*
  let sumTestStat = 0
  statInTredn.forEach(function (item) {
    if (typeof item.profitInTrend == 'number')
      if (item.profitInTrend != '') {
        sumTestStat += item.profitInTrend
      }
  })
  console.log(`итоговая прибыль = ${+sumTestStat.toFixed(2)} USD (проверка по statInTredn)`)
  */

  // вычисление потенциальной средней прибыли по убыточным сделкам
  // PS: можно сделать внутри кода после строчки 195
  const negativeDeals = []
  let jj = 0
  deals.forEach(function (item) {
    if (item.profit < 0) {
      negativeDeals[jj] = {
        profit: item.profit,
        percent: item.percent,
        varMaxProfit: item.varMaxProfit,
        procentVMP: item.procentVMP,
      }
      jj += 1
    }
  })
  console.log(``)
  console.log(`убыточные сделки:`)
  console.table(negativeDeals)

  let arrayOfVMP = []
  negativeDeals.forEach(function (item) {
    if (item.procentVMP > 0) {
      arrayOfVMP.push(item.procentVMP)
    }
  })
  let minOfVMP = Math.min.apply(null, arrayOfVMP)
  let maxOfVMP = Math.max.apply(null, arrayOfVMP)
  let averageOfVMP = arrayOfVMP.reduce((a, b) => a + b) / arrayOfVMP.length
  console.log(`minOfVMP = ${minOfVMP}%`)
  console.log(`maxOfVMP = ${maxOfVMP}%`)
  console.log(`averageOfVMP = ${+averageOfVMP.toFixed(2)}%`)

  let countMoreAverageOfVMP = 0
  let countLessAverageOfVMP = 0
  negativeDeals.forEach(function (item) {
    if (item.procentVMP > averageOfVMP) {
      countMoreAverageOfVMP++
    } else {
      countLessAverageOfVMP++
    }
  })
  console.log(
    `кол-во убыточных сделок, которые можно закрыть в TP выше averageOfVMP = ${countMoreAverageOfVMP}`
  )
  console.log(
    `кол-во убыточных сделок, которые нельзя закрыть в TP выше averageOfVMP = ${countLessAverageOfVMP}`
  )

  // вычисление времени работы всего скрипта
  const endProgram = new Date().getTime() // текущая дата
  const diffInTimeProgram = endProgram - startProgramAt
  const OneSecond = 1000
  const diffInSecond = Math.round(diffInTimeProgram / OneSecond)
  console.log(
    `время выполнения скрипта = ${diffInSecond} секунд (${
      diffInSecond / 60
    } минут)`
  )

  const statistics = {
    deposit: deposit,
    allDealsCount: allDealsReal.length,
    globalProfit: +profit.toFixed(2),
    roi: +roi.toFixed(2),
    dayOfTrade: diffInDays,
    roiPerYear: +roiPerYear.toFixed(2),
    drawdown: min,
    drawdownPer: Math.round((min / deposit) * 10000) / 100,
    diffInSecond: diffInSecond,
    countOfPositive: countOfPositive,
    countOfNegative: countOfNegative,
    minOfVMP: minOfVMP,
    maxOfVMP: maxOfVMP,
    averageOfVMP: averageOfVMP,
    countMoreAverageOfVMP: countMoreAverageOfVMP,
    countLessAverageOfVMP: countLessAverageOfVMP,
    resultOfDeposit: resultOfDeposit,
    multiplierMayBe: multiplierMayBe,
  }

  console.log('программа завершена (ОК)')

  return statistics
}

function findTrends(arg) {
  let FractalsUp = false // факт наличия фрактала на старшем ТФ
  let FractalsDown = false
  let FractalsUpPrice = 0 // значение цены фрактала
  let FractalsDownPrice = 0
  let FractalUpTime = '' // человеческий вид времи фрактала для проверки работы условий
  let FractalDownTime = ''
  let whatTrend = []
  let numberOfTrend = 0
  let whatTrendFiltered = []
  let j = 0

  for (let i = 4; i < arg.length; i++) {
    // ищем Bearish (медвежий) Fractal. Факртал находится на позиции [i-2]
    if (
      arg[i - 4].highPrice < arg[i - 2].highPrice &&
      arg[i - 3].highPrice < arg[i - 2].highPrice &&
      arg[i - 1].highPrice < arg[i - 2].highPrice &&
      arg[i].highPrice < arg[i - 2].highPrice
    ) {
      FractalsUp = true
      FractalsUpPrice = arg[i - 2].highPrice
      FractalUpTime = arg[i - 2].openTime
    } else {
      // ищем Bullish (бычий) Fractal
      if (
        arg[i - 4].lowPrice > arg[i - 2].lowPrice &&
        arg[i - 3].lowPrice > arg[i - 2].lowPrice &&
        arg[i - 1].lowPrice > arg[i - 2].lowPrice &&
        arg[i].lowPrice > arg[i - 2].lowPrice
      ) {
        FractalsDown = true
        FractalsDownPrice = arg[i - 2].lowPrice
        FractalDownTime = arg[i - 2].openTime
      }
    }
    // определяем тренды
    // PS в реальном времени необходимо сравнивать фрактал с текущей ценой на рынке
    if (FractalsDown) {
      if (arg[i].lowPrice < FractalsDownPrice) {
        whatTrend[numberOfTrend] = {
          trend: 'DownTrend',
          fractalTime: timestampToDateHuman(FractalDownTime),
          // ftactalTimeStamp: FractalDownTime,
          fractalPrice: FractalsDownPrice,
          priceTimeStamp: arg[i].openTime,
          priceTime: timestampToDateHuman(arg[i].openTime),
          price: arg[i].lowPrice, // поле носит чисто ифнормационный характер
        }
        numberOfTrend += 1
        FractalsDown = false
        trendDown = true
        trendUp = false
      }
    }
    if (FractalsUp) {
      if (arg[i].highPrice > FractalsUpPrice) {
        whatTrend[numberOfTrend] = {
          trend: 'UpTrend',
          fractalTime: timestampToDateHuman(FractalUpTime),
          // ftactalTimeStamp: FractalUpTime,
          fractalPrice: FractalsUpPrice,
          priceTimeStamp: arg[i].openTime,
          priceTime: timestampToDateHuman(arg[i].openTime),
          price: arg[i].highPrice, // поле носит чисто ифнормационный характер
        }
        numberOfTrend += 1
        FractalsUp = false
        trendUp = true
        trendDown = false
      }
    }
  }

  console.log('тренды (без фильтрации):')
  console.table(whatTrend)

  // фильтруем массив c трендами: соединяем повторяющиеся тренды
  /*
  whatTrendFiltered[j] = whatTrend[0]
  for (let i = 1; i < whatTrend.length; i++) {
    if (whatTrendFiltered[j].trend == whatTrend[i].trend) continue
    else {
      j++
      whatTrendFiltered[j] = whatTrend[i]
    }
  }  
  console.log('тренды (после фильтрации):')
  console.table(whatTrendFiltered)
  console.log(`общее кол-во трендов = ${whatTrendFiltered.length} шт (вызов по whatTrendFiltered из функции findTrends)`)
  */
  // let startOfTrend = whatTrendFiltered[0].priceTimeStamp

  //return [whatTrendFiltered, startOfTrend]
  //return whatTrendFiltered

  // скорее всего придется передавать массив со сдвигом влево на одну свечу, для проверки условия ниже
  // передаем значения фракталов чтобы начать торговлю на младшем ТФ именно с момента пробития фракталов ценой
  // return [whatTrend, FractalsUpPrice, FractalsDownPrice]

  return whatTrend
}

async function getTrendsAsync(
  array,
  symbol,
  lowerTimeFrame,
  dateFinish,
  deposit,
  partOfDeposit,
  multiplier
) {
  let dealsGlobal = [] // собирает все сделки
  let dealsGlobal2 = [] // собирает массивы сделок по трендам
  let dealsGlobalReal = [] // собираем сделки с учетом: депозита, % использования депозита и плеча
  let dealsGlobalReal2 = [] // собирает массивы сделок по трендам
  let depositTemp = deposit
  let temp // собирает информацию внутри каждого тренда (сделки и статистику по тренду)
  let maxOfTrend = 0 // вычисляем длину самого большого тренда
  let statInTredn = [] // для статистики сделок внутри тренда
  console.log(
    `общее кол-во трендов = ${array.length} шт (передано в функцию getTrends)`
  )
  const oneHourStamp = 1000 * 60 * 60 // добавляем 1 час к каждому тренду

  for (let i = 0; i < array.length; i++) {
    if (i != array.length - 1) {
      // берем все тренды, кроме последнего
      try {
        // const candlesJunior = await client.getKlines({ symbol: symbol, interval: lowerTimeFrame, startTime: array[i].priceTimeStamp, endTime: (array[i+1].priceTimeStamp + oneHourStamp), limit: 1000})
        const candlesJunior = await client.getKlines({
          symbol: symbol,
          interval: lowerTimeFrame,
          startTime: array[i].priceTimeStamp,
          endTime: array[i + 1].priceTimeStamp,
          limit: limitInTrend,
        })
        const objectJunior = candlesToObject(candlesJunior)
        console.log('')
        console.log(`обработка данных ${i}-го тренда...`)
        console.log(
          `Длина ${i} тренда составляет ${objectJunior.length} свечей`
        )
        console.log(
          `Начало тренда: ${timestampToDateHuman(
            array[i].priceTimeStamp
          )}, заверщение тренда: ${timestampToDateHuman(
            array[i + 1].priceTimeStamp
          )}`
        )

        // вычисляем самый длинный массив младшего ТФ
        if (maxOfTrend < objectJunior.length) {
          maxOfTrend = objectJunior.length
        }
        temp = trade(
          objectJunior,
          array[i].trend,
          i,
          depositTemp,
          partOfDeposit,
          multiplier
        )
        dealsGlobal = dealsGlobal.concat(temp.deals) // собираем все сделки
        dealsGlobal2.push(temp.deals) // для вывода клиенту сделок внутри каждого тренда
        statInTredn = statInTredn.concat(temp.statInTredn) // собираем статистику по трендам
        dealsGlobalReal = dealsGlobalReal.concat(temp.dealsReal) // собираем сделки с реальным депозитом
        dealsGlobalReal2.push(temp.dealsReal) // собираем сделки в массив по трендам
        depositTemp = temp.depositTemp // сохраняем накопившийся депозит
      } catch (err) {
        console.error('get Account Trade List error: ', err)
      }
    } else {
      // если это последний тренд, то берем текущую последнюю дату
      // console.log(`блок расчета последнего тренда!!`)
      // let currentTime = new Date().getTime() // текущая дата для последнего тренда
      // console.log(`currentTime вначале = ${timestampToDateHuman(currentTime)}`)
      // console.log(`последняя дата последнего тренда = ${timestampToDateHuman(array[i].priceTimeStamp)}`)
      /*

      if (currentTime > array[i].priceTimeStamp) {
        console.log(
          `разница между currentTime и последней датой в массиве = ${
            currentTime - array[i].priceTimeStamp
          }`
        )
        currentTime = array[i].priceTimeStamp
      }
      console.log(
        `currentTime после сравнения = ${timestampToDateHuman(currentTime)}`
      )
      */
      try {
        const candlesJunior = await client.getKlines({
          symbol: symbol,
          interval: lowerTimeFrame,
          startTime: array[i].priceTimeStamp,
          endTime: Date.parse(dateFinish),
          limit: limitInTrend,
        })
        const objectJunior = candlesToObject(candlesJunior)
        console.log('')
        console.log(`обработка данных ${i}-го тренда из ${array.length - 1}...`)
        console.log(
          `Длина ${i} тренда составляет ${objectJunior.length} свечей`
        )
        console.log(
          `Начало тренда: ${timestampToDateHuman(
            array[i].priceTimeStamp
          )}, заверщение тренда: ${timestampToDateHuman(
            Date.parse(dateFinish)
          )}`
        )

        // вычисляем самый длинный массив младшего ТФ
        if (maxOfTrend < objectJunior.length) {
          maxOfTrend = objectJunior.length
        }
        temp = trade(
          objectJunior,
          array[i].trend,
          i,
          depositTemp,
          partOfDeposit,
          multiplier
        )
        dealsGlobal = dealsGlobal.concat(temp.deals) // собираем все сделки
        dealsGlobal2.push(temp.deals) // для вывода клиенту сделок внутри каждого тренда
        statInTredn = statInTredn.concat(temp.statInTredn) // собираем статистику по трендам
        dealsGlobalReal = dealsGlobalReal.concat(temp.dealsReal) // собираем сделки с реальным депозитом
        dealsGlobalReal2.push(temp.dealsReal) // собираем сделки в массив по трендам
        depositTemp = temp.depositTemp // сохраняем накопившийся депозит
      } catch (err) {
        console.error('get Account Trade List error: ', err)
      }
    }
  }
  // console.log('ЗАВЕРШЕНИЕ функции getTrends')
  // console.log(`передано из getTrends общее кол-во сделок: ${dealsGlobal.length}`)
  return [
    dealsGlobal,
    maxOfTrend,
    statInTredn,
    dealsGlobal2,
    depositTemp,
    dealsGlobalReal,
    dealsGlobalReal2,
  ]
}

function trade(array, trend, index, deposit, partOfDeposit, multiplier) {
  let FractalsUp = false // факт наличия фрактала на младшем ТФ
  let FractalsDown = false
  let FractalsUpPrice = 0 // значение цены фрактала
  let FractalsDownPrice = 0
  let FractalUpTime = 0 // время фрактала для проверки работы условий
  let FractalDownTime = 0
  let stopLoss = 0
  let inLongPosition = false
  let inShortPosition = false
  let numberOfPosition = 0
  let positionUp = 0
  let positionDown = 0
  let positionTime = 0
  let lastFractal = 0 // для закрытия сделок в конце тренда
  let deals = [] // сделки внутри тренда
  let dealsReal = [] // сделки с учетом: депозита, % использования депозита и плеча
  let amountOfPosition = 0 // для расчета объема входа в сделку
  let depositTemp = Number(deposit)
  let profit = 0 // прибыль или убыток внутри каждой сделки
  let varMaxProfit = 0 // расчет максимально возможной потенциальной прибыли в каждой сделке
  let timeOfVMP = 0 // время наступленмя varMaxProfit

  console.log(`передаваемое значение тренда = ${trend}`)
  // console.log('тип трендовой переменной: ' + typeof(trend))
  // console.log('переданный массив')
  // console.log(array)

  // в цикле ищем фракталы внутри тренда на младщем ТФ и запускаем сделки
  for (let i = 4; i < array.length; i++) {
    if (
      array[i - 4].lowPrice > array[i - 2].lowPrice &&
      array[i - 3].lowPrice > array[i - 2].lowPrice &&
      array[i - 1].lowPrice > array[i - 2].lowPrice &&
      array[i].lowPrice > array[i - 2].lowPrice
    ) {
      FractalsDown = true
      FractalsDownPrice = array[i - 2].lowPrice
      // console.log(`фрактал снизу =  ${FractalsDownPrice}, дата ${timestampToDateHuman(FractalDownTime)}`)
    } else if (
      array[i - 4].highPrice < array[i - 2].highPrice &&
      array[i - 3].highPrice < array[i - 2].highPrice &&
      array[i - 1].highPrice < array[i - 2].highPrice &&
      array[i].highPrice < array[i - 2].highPrice
    ) {
      FractalsUp = true
      FractalsUpPrice = array[i - 2].highPrice
    }

    if (trend == 'UpTrend') {
      // console.log('ищем вход внутри UpTrend')
      if (FractalsUp) {
        // console.log(`есть фрактал: ${FractalsUpPrice}`)
        if (!inLongPosition) {
          if (array[i].highPrice > FractalsUpPrice) {
            stopLoss = FractalsDownPrice
            lastFractal = FractalsDownPrice
            // FractalsUp = false
            // FractalsUpPrice = 0
            // positionUp = Number(array[i][2])
            positionUp = FractalsUpPrice // вход в позицию по цене фрактала
            inLongPosition = true
            positionTime = array[i].openTime
            varMaxProfit = FractalsUpPrice // фиксируем на уровне входа в сделку
            timeOfVMP = array[i].openTime
            // console.log('зашли в позицию')
          }
        } else if (inLongPosition) {
          if (FractalsDownPrice > stopLoss) {
            stopLoss = FractalsDownPrice
            lastFractal = FractalsDownPrice
          }
          if (varMaxProfit < array[i].highPrice) {
            varMaxProfit = array[i].highPrice
            timeOfVMP = array[i].openTime
          }
          if (array[i].lowPrice < stopLoss) {
            deals[numberOfPosition] = {
              openPosition: 'Buy',
              openPrice: positionUp,
              openTime: timestampToDateHuman(positionTime),
              //openTimestamp: positionTime,
              closePosition: 'Sell',
              // closePrice: Number(array[i][3]), // неправильно
              closePrice: stopLoss, // выходим по цене Stop Loss
              closeTime: timestampToDateHuman(array[i].openTime),
              //profit: +(array[i].lowPrice - positionUp).toFixed(2), // неправильно
              profit: +(stopLoss - positionUp).toFixed(2),
              //percent: +(((array[i].lowPrice - positionUp) / positionUp) * 100).toFixed(2), // неправильно
              percent: +(((stopLoss - positionUp) / positionUp) * 100).toFixed(
                2
              ),
              // stopLoss: stopLoss, // избыточная информация
              varMaxProfit: +(varMaxProfit - positionUp).toFixed(2),
              procentVMP: +((varMaxProfit / positionUp - 1) * 100).toFixed(2),
              timeOfVMP: timestampToDateHuman(timeOfVMP),
            }
            // формируем инфу по сделке на реальном депо:
            amountOfPosition = +(
              (depositTemp / positionUp) *
              partOfDeposit *
              multiplier
            ).toFixed(8)
            profit = (stopLoss - positionUp) * amountOfPosition
            depositTemp += profit
            // console.log(`тип deposit = ${typeof deposit}, тип amountOfPosition = ${typeof amountOfPosition}, тип depositTemp = ${typeof depositTemp}`)
            dealsReal[numberOfPosition] = {
              openPosition: 'Buy',
              openPrice: positionUp,
              openTime: timestampToDateHuman(positionTime),
              amountOfPosition: amountOfPosition,
              closePosition: 'Sell',
              closePrice: stopLoss, // выходим по цене Stop Loss
              closeTime: timestampToDateHuman(array[i].openTime),
              profit: +profit.toFixed(2),
              percent: +((profit / positionUp) * 100).toFixed(2),
              deposit: +depositTemp.toFixed(2),
            }

            inLongPosition = false
            stopLoss = 0
            numberOfPosition += 1
            positionUp = 0
            positionTime = 0
            // console.log('вышли из позиции')
            FractalsUp = false
            FractalsUpPrice = 0
          } else if (i == array.length - 1) {
            // если тренд закончен, но сделка еще не закрыта
            if (array[i].lowPrice >= lastFractal) {
              // если текущая цена еще выше последнего нижнего фрактала
              deals[numberOfPosition] = {
                openPosition: 'Buy',
                openPrice: positionUp,
                openTime: timestampToDateHuman(positionTime),
                //openTimestamp: positionTime,
                closePosition: 'Sell',
                closePrice: array[i].lowPrice,
                closeTime: timestampToDateHuman(array[i].openTime),
                profit: +(array[i].lowPrice - positionUp).toFixed(2),
                percent: +(
                  ((array[i].lowPrice - positionUp) / positionUp) *
                  100
                ).toFixed(2),
                lastPrice: array[i].lowPrice,
                varMaxProfit: +(varMaxProfit - positionUp).toFixed(2),
                procentVMP: +((varMaxProfit / positionUp - 1) * 100).toFixed(2),
                timeOfVMP: timestampToDateHuman(timeOfVMP),
              }

              // формируем инфу по сделке на реальном депо:
              amountOfPosition = +(
                (depositTemp / positionUp) *
                partOfDeposit *
                multiplier
              ).toFixed(8)
              profit = (array[i].lowPrice - positionUp) * amountOfPosition
              depositTemp += profit
              // console.log(`тип deposit = ${typeof deposit}, тип amountOfPosition = ${typeof amountOfPosition}, тип depositTemp = ${typeof depositTemp}`)
              dealsReal[numberOfPosition] = {
                openPosition: 'Buy',
                openPrice: positionUp,
                openTime: timestampToDateHuman(positionTime),
                amountOfPosition: amountOfPosition,
                closePosition: 'Sell',
                closePrice: array[i].lowPrice,
                closeTime: timestampToDateHuman(array[i].openTime),
                profit: +profit.toFixed(2),
                percent: +((profit / positionUp) * 100).toFixed(2),
                deposit: +depositTemp.toFixed(2),
                lastPrice: array[i].lowPrice,
              }
            } else {
              // если текущая цена ниже последнего нижнего фрактала, то закрываем по цене фрактала

              // продумать как на боевом роботе будут закрываться позиции после окончания тренда, т.к. ниже позиция закрывается по последнему фракталу
              deals[numberOfPosition] = {
                openPosition: 'Buy',
                openPrice: positionUp,
                openTime: timestampToDateHuman(positionTime),
                //openTimestamp: positionTime,
                closePosition: 'Sell',
                closePrice: lastFractal,
                closeTime: timestampToDateHuman(array[i].openTime),
                profit: lastFractal - positionUp,
                percent: +(
                  ((lastFractal - positionUp) / positionUp) *
                  100
                ).toFixed(2),
                lf: lastFractal,
                varMaxProfit: +(varMaxProfit - positionUp).toFixed(2),
                procentVMP: +((varMaxProfit / positionUp - 1) * 100).toFixed(2),
                timeOfVMP: timestampToDateHuman(timeOfVMP),
              }

              // формируем инфу по сделке на реальном депо:
              amountOfPosition = +(
                (depositTemp / positionUp) *
                partOfDeposit *
                multiplier
              ).toFixed(2)
              profit = (lastFractal - positionUp) * amountOfPosition
              depositTemp += profit
              // console.log(`тип deposit = ${typeof deposit}, тип amountOfPosition = ${typeof amountOfPosition}, тип depositTemp = ${typeof depositTemp}`)
              dealsReal[numberOfPosition] = {
                openPosition: 'Buy',
                openPrice: positionUp,
                openTime: timestampToDateHuman(positionTime),
                amountOfPosition: amountOfPosition,
                closePosition: 'Sell',
                closePrice: lastFractal,
                closeTime: timestampToDateHuman(array[i].openTime),
                profit: +profit.toFixed(2),
                percent: +((profit / positionUp) * 100).toFixed(2),
                deposit: +depositTemp.toFixed(2),
                lf: lastFractal,
              }
            }
            lastFractal = 0
          }
        }
      }
    } else if (trend == 'DownTrend') {
      if (FractalsDown) {
        if (!inShortPosition) {
          //stopLoss = FractalsUpPrice
          //lastFractal = FractalsUpPrice
          if (array[i].lowPrice < FractalsDownPrice) {
            stopLoss = FractalsUpPrice
            lastFractal = FractalsUpPrice
            // FractalsUp = false
            // FractalsUpPrice = 0
            inShortPosition = true
            //positionDown = Number(array[i][3])
            positionDown = FractalsDownPrice // открываем short по цене фрактала
            positionTime = array[i].openTime
            varMaxProfit = FractalsDownPrice // фиксируем на уровне входа в сделку
            timeOfVMP = array[i].openTime
            // console.log('зашли в позицию')
          }
        } else if (inShortPosition) {
          if (FractalsUpPrice < stopLoss) {
            stopLoss = FractalsUpPrice
            lastFractal = FractalsUpPrice
          }
          if (varMaxProfit > array[i].lowPrice) {
            varMaxProfit = array[i].lowPrice
            timeOfVMP = array[i].openTime
          }
          //if (stopLoss > 0)
          if (array[i].highPrice > stopLoss) {
            if (stopLoss > 0) {
              // бывают ситуации, когда в начале нового тренда верхний фрактал еще не сформировался
              deals[numberOfPosition] = {
                openPosition: 'Sell',
                openPrice: positionDown,
                openTime: timestampToDateHuman(positionTime),
                //openTimestamp: positionTime,
                closePosition: 'Buy',
                // closePrice: Number(array[i][2]),
                closePrice: stopLoss, // выходим по цене Stol Loss
                closeTime: timestampToDateHuman(array[i].openTime),
                // profit: +(positionDown - array[i].highPrice).toFixed(2), // неправильно
                profit: +(positionDown - stopLoss).toFixed(2),
                // percent: +(((positionDown - array[i].highPrice) / positionDown) * 100).toFixed(2), // неправильно
                percent: +(
                  ((positionDown - stopLoss) / positionDown) *
                  100
                ).toFixed(2),
                // stopLoss: stopLoss, // избыточная информация
                varMaxProfit: +(positionDown - varMaxProfit).toFixed(2),
                procentVMP: +((positionDown / varMaxProfit - 1) * 100).toFixed(
                  2
                ),
                timeOfVMP: timestampToDateHuman(timeOfVMP),
              }
              // формируем инфу по сделке на реальном депо:

              amountOfPosition = +(
                (depositTemp / positionDown) *
                partOfDeposit *
                multiplier
              ).toFixed(8)
              profit = (positionDown - stopLoss) * amountOfPosition
              depositTemp += profit
              // console.log(`тип deposit = ${typeof deposit}, тип amountOfPosition = ${typeof amountOfPosition}, тип depositTemp = ${typeof depositTemp}`)
              dealsReal[numberOfPosition] = {
                openPosition: 'Sell',
                openPrice: positionDown,
                openTime: timestampToDateHuman(positionTime),
                amountOfPosition: amountOfPosition,
                closePosition: 'Buy',
                closePrice: stopLoss, // выходим по цене Stop Loss
                closeTime: timestampToDateHuman(array[i].openTime),
                profit: +profit.toFixed(2),
                percent: +((profit / positionDown) * 100).toFixed(2),
                deposit: +depositTemp.toFixed(2),
              }

              inShortPosition = false
              stopLoss = 0
              numberOfPosition += 1
              positionDown = 0
              // console.log('вышли из позиции')
              FractalsDown = false
              FractalsDownPrice = 0
              positionTime = 0
            }
          } else if (i == array.length - 1) {
            // если тренд закончен, но сделка еще не закрыта
            if (array[i].highPrice <= lastFractal) {
              // если текущая цена еще ниже последнего верхнего фрактала
              deals[numberOfPosition] = {
                openPosition: 'Sell',
                openPrice: positionDown,
                openTime: timestampToDateHuman(positionTime),
                //openTimestamp: positionTime,
                closePosition: 'Buy',
                closePrice: array[i].highPrice,
                closeTime: timestampToDateHuman(array[i].openTime),
                profit: +(positionDown - array[i].highPrice).toFixed(2),
                percent: +(
                  ((positionDown - array[i].highPrice) / positionDown) *
                  100
                ).toFixed(2),
                lastPrice: array[i].highPrice,
                varMaxProfit: +(positionDown - varMaxProfit).toFixed(2),
                procentVMP: +((positionDown / varMaxProfit - 1) * 100).toFixed(
                  2
                ),
                timeOfVMP: timestampToDateHuman(timeOfVMP),
              }

              // формируем инфу по сделке на реальном депо:
              amountOfPosition = +(
                (depositTemp / positionDown) *
                partOfDeposit *
                multiplier
              ).toFixed(8)
              profit = (positionDown - array[i].highPrice) * amountOfPosition
              depositTemp += profit
              // console.log(`тип deposit = ${typeof deposit}, тип amountOfPosition = ${typeof amountOfPosition}, тип depositTemp = ${typeof depositTemp}`)
              dealsReal[numberOfPosition] = {
                openPosition: 'Sell',
                openPrice: positionDown,
                openTime: timestampToDateHuman(positionTime),
                amountOfPosition: amountOfPosition,
                closePosition: 'Buy',
                closePrice: array[i].highPrice,
                closeTime: timestampToDateHuman(array[i].openTime),
                profit: +profit.toFixed(2),
                percent: +((profit / positionDown) * 100).toFixed(2),
                deposit: +depositTemp.toFixed(2),
                lastPrice: array[i].highPrice,
              }
            } else {
              deals[numberOfPosition] = {
                openPosition: 'Sell',
                openPrice: positionDown,
                openTime: timestampToDateHuman(positionTime),
                //openTimestamp: positionTime,
                closePosition: 'Buy',
                closePrice: lastFractal,
                closeTime: timestampToDateHuman(array[i].openTime),
                profit: positionDown - lastFractal,
                percent: +(
                  ((positionDown - lastFractal) / positionDown) *
                  100
                ).toFixed(2),
                lf: lastFractal,
                varMaxProfit: +(positionDown - varMaxProfit).toFixed(2),
                procentVMP: +((positionDown / varMaxProfit - 1) * 100).toFixed(
                  2
                ),
                timeOfVMP: timestampToDateHuman(timeOfVMP),
              }
              // формируем инфу по сделке на реальном депо:
              amountOfPosition = +(
                (depositTemp / positionDown) *
                partOfDeposit *
                multiplier
              ).toFixed(8)
              profit = (positionDown - lastFractal) * amountOfPosition
              depositTemp += profit
              // console.log(`тип deposit = ${typeof deposit}, тип amountOfPosition = ${typeof amountOfPosition}, тип depositTemp = ${typeof depositTemp}`)
              dealsReal[numberOfPosition] = {
                openPosition: 'Sell',
                openPrice: positionDown,
                openTime: timestampToDateHuman(positionTime),
                amountOfPosition: amountOfPosition,
                closePosition: 'Buy',
                closePrice: lastFractal,
                closeTime: timestampToDateHuman(array[i].openTime),
                profit: +profit.toFixed(2),
                percent: +((profit / positionDown) * 100).toFixed(2),
                deposit: +depositTemp.toFixed(2),
                lf: lastFractal,
              }
            }
            lastFractal = 0
          }
        }
      }
    }
  }

  // console.log('сделки внутри функции trade:')
  // console.table(deals)
  // console.log(`кол-во сделок внутри тренда = ${deals.length} штук (внутри функции trade)`)

  console.log('РЕАЛЬНЫЕ сделки внутри функции trade:')
  console.table(dealsReal)

  // подсчет прибыли внутри тренда по dealsClass
  /*
  let summProfit = 0
  deals.forEach(function (item) {
    if (typeof item.profit == 'number') summProfit += item.profit
  })
  console.log(`прибыль внутри тренда = ${+summProfit.toFixed(2)} USD (функция считает по полю profit)`)
  */
  let summProfit = 0
  if (dealsReal.length == 1) {
    summProfit = dealsReal[0].deposit - Number(deposit)
  } else {
    summProfit = dealsReal[dealsReal.length - 1].deposit - dealsReal[0].deposit
    console.log(
      `прибыль внутри тренда = ${+summProfit.toFixed(
        2
      )} USD (функция считает по разнице между депозитом в начале тренда и в конце тренда)`
    )
  }

  // для статистики внутри трендов
  let statInTredn = []
  let jj = 0

  statInTredn[jj] = {
    indexOfTrend: index,
    trendIs: trend,
    startTrend: timestampToDateHuman(array[0].openTime),
    endTrend: timestampToDateHuman(array[array.length - 1].openTime),
    profitInTrend: +summProfit.toFixed(2),
  }
  jj++

  return {
    deals: deals,
    statInTredn: statInTredn,
    dealsReal: dealsReal,
    depositTemp: +depositTemp.toFixed(2),
  }
}
