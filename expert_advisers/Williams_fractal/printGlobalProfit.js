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
    averageOfVMP: +averageOfVMP.toFixed(2),
    countMoreAverageOfVMP: countMoreAverageOfVMP,
    countLessAverageOfVMP: countLessAverageOfVMP,
    resultOfDeposit: resultOfDeposit,
    multiplierMayBe: multiplierMayBe,
  }

  console.log('программа завершена (ОК)')

  return statistics
}

module.exports = printGlobalProfit
