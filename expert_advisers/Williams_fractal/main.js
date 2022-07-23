const config = require('config')
const diffCandle = require('./diffCandle')
const candlesToObject = require('./candlesToObject')
const findTrends = require('./findTrends')
const getTrendsAsync = require('./getTrends')
const timestampToDateHuman = require('./timestampToDateHuman')
const printGlobalProfit = require('./printGlobalProfit')
const getCandles = require('./getCandles')

const limitSeniorTrend = config.get('limitSeniorTrend') || 1000

module.exports = { startProgram2 }

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
  // let candlesSenior = []
  let candlesSeniorFull = []

  try {
    for (let i = 0; i < arrayOf1kPeriod.length; i++) {
      const candlesSenior = await getCandles(
        symbol,
        seniorTimeFrame,
        arrayOf1kPeriod[i].dateFirst,
        arrayOf1kPeriod[i].dateSecond,
        limitSeniorTrend
      )
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
      //depositTemp, // итоговый депозит после трейдинга на исторических данных
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
