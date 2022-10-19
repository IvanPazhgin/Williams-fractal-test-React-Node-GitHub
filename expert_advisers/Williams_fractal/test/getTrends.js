// const { USDMClient } = require('binance')
const trade = require('./trade')
const config = require('config')
const candlesToObject = require('../../common.func/candlesToObject4test')
const timestampToDateHuman = require('../../common.func/timestampToDateHuman')
const getCandles = require('../../../API/binance.engine/usdm/getCandles.5param')

const limitInTrend = config.get('limitInTrend') || 1000

async function getTrendsAsync(
  array,
  symbol,
  lowerTimeFrame,
  dateFinish,
  deposit,
  partOfDeposit,
  multiplier
) {
  /*
  const API_KEY = config.get('API_KEY') || ''
  const API_SECRET = config.get('API_SECRET') || ''

  const client = new USDMClient({
    api_key: API_KEY,
    api_secret: API_SECRET,
  })
  */

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
        /*
        const candlesJunior = await client.getKlines({
          symbol: symbol,
          interval: lowerTimeFrame,
          startTime: array[i].priceTimeStamp,
          endTime: array[i + 1].priceTimeStamp,
          limit: limitInTrend,
        })
        */

        const candlesJunior = await getCandles(
          symbol,
          lowerTimeFrame,
          array[i].priceTimeStamp,
          array[i + 1].priceTimeStamp,
          limitInTrend
        )

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
        console.log('')
        console.log(`обработка данных ${i}-го тренда из ${array.length - 1}...`)
        console.log(
          `Начало тренда: ${timestampToDateHuman(
            array[i].priceTimeStamp
          )}, заверщение тренда: ${timestampToDateHuman(
            Date.parse(dateFinish)
          )}`
        )
        /*
        const candlesJunior = await client.getKlines({
          symbol: symbol,
          interval: lowerTimeFrame,
          startTime: array[i].priceTimeStamp,
          endTime: Date.parse(dateFinish),
          limit: limitInTrend,
        })
        */

        const candlesJunior = await getCandles(
          symbol,
          lowerTimeFrame,
          array[i].priceTimeStamp,
          Date.parse(dateFinish),
          limitInTrend
        )

        const objectJunior = candlesToObject(candlesJunior)
        console.log(
          `Длина ${i} тренда составляет ${objectJunior.length} свечей`
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
    //depositTemp,
    dealsGlobalReal,
    dealsGlobalReal2,
  ]
}

module.exports = getTrendsAsync
