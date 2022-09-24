const { intervalArray } = require('../common.files/intervals')
const { input_parameters, comment } = require('./input_parameters')
const findTrends = require('./findTrends')
const deals = require('./deals')
const statistics = require('./statistics')
const OptionsForSave = require('./misc/optionsForSave')
const saveDeals = require('../utils/saveDeals')

function startWilliamsTest() {
  let trendsTemp = []
  let dealsTemp = []
  let statisticsTemp = []
  let optionsTemp
  let statisticsFull = []
  const startProgram = new Date()
  //let optionsTemp = new OptionsForSave()

  for (let i = 0; i < intervalArray.length - 1; i++) {
    for (let j = i + 1; j < intervalArray.length; j++) {
      // 1. поиск трендов на старших ТФ
      //console.log(`\nПоиск трендов: Senior interval = ${intervalArray[i]} / Junior interval = ${intervalArray[j]}`)
      console.log(`\nПоиск трендов: ${intervalArray[i]} / ${intervalArray[j]}`)
      optionsTemp = new OptionsForSave(
        intervalArray[i],
        intervalArray[j],
        comment.trends
      )
      trendsTemp = findTrends(
        input_parameters,
        intervalArray[i],
        intervalArray[j],
        optionsTemp
      )

      // 2. поиск сделок
      //console.log(`Поиск сделок: Senior interval = ${intervalArray[i]} / Junior interval = ${intervalArray[j]}`)
      console.log(`Поиск сделок: ${intervalArray[i]} / ${intervalArray[j]}`)
      optionsTemp = new OptionsForSave(
        intervalArray[i],
        intervalArray[j],
        comment.deals
      )
      dealsTemp = deals(
        trendsTemp.trends,
        trendsTemp.candlesJunior,
        optionsTemp
      )

      // 3. сбор статистики
      console.log(`Сбор статистики: ${intervalArray[i]} / ${intervalArray[j]}`)
      optionsTemp = new OptionsForSave(
        intervalArray[i],
        intervalArray[j],
        comment.statistics
      )
      statisticsTemp = statistics(dealsTemp, optionsTemp)
      statisticsFull = statisticsFull.concat(statisticsTemp.summ)
    } // цикл по младшему ТФ
  } // цикл по старшему ТФ

  // 4. сохранение общей статистики
  //console.table(statisticsFull)
  optionsTemp = new OptionsForSave('all', 'intervals', comment.statistics)
  saveDeals(statisticsFull, optionsTemp)

  /*
  class Mega {
    constructor(options) {
      this.trendSenior // = options.intervalArray[i]
      this.trendJunior // = options.intervalArray[j]
      this.trends
      this.candlesJunior
      this.deals
      this.statistics
      this.arrayNegativeDeals
      this.summ
    }
  }
  */

  // 5. общая статистика
  const endProgram = new Date()
  const diffTime = (endProgram - startProgram) / 1000
  console.log(
    `время выполнения приложения = ${diffTime} секунд (${+(
      diffTime / 60
    ).toFixed(2)} минут)`
  )
  console.log(`приложение завершило работу (ОК)`)
}

module.exports = startWilliamsTest
