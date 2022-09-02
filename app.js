// по видео Владилена Минина

const express = require('express')
const config = require('config')
const path = require('path')
const {
  startWilliams,
} = require('./expert_advisers/Williams_fractal/mainWilliams')
const startAlex = require('./expert_advisers/Alex/mainAlex')
// const testFunctionBinance = require('./binance_Engine/tests_Ivan/testFunOfBinance')
const testOfNewFuctiouns = require('./expert_advisers')

const app = express()

app.use(express.json({ extended: true }))

//app.use('/api/userrequest', require('./routes/symbol.TF'))
//app.use('localhost:5000', require('./routes/symbol.TF')) // передает параметры запроса на сервен, но возвращает ошибку в браузере: Unexpected token o in JSON at position 0
//app.use('/', require('./routes/symbol.TF')) // в консоли браузера выдает ошибку: POST http://localhost:3000/ 500 (Internal Server Error)

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = config.get('port') || 5000

async function start() {
  try {
    // подключаемся к базе данных, если она есть
    app.listen(PORT, () =>
      console.log(`App has been started on port ${PORT}...`)
    )
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()
testOfNewFuctiouns()

app.post('/', async function (req, res) {
  console.log('Williams: прилетел запрос на сервер:')
  console.table(req.body)
  // diffCandle(req.body.dateStart, req.body.dateFinish, req.body.seniorTimeFrame)
  //startProgram2(req.body.symbol, req.body.seniorTimeFrame, req.body.lowerTimeFrame)
  //res.send('ok')

  const result = await startWilliams(
    req.body.symbol,
    req.body.seniorTimeFrame,
    req.body.lowerTimeFrame,
    req.body.dateStart,
    req.body.dateFinish,
    req.body.deposit,
    req.body.partOfDeposit,
    req.body.multiplier
  )
  res.json(result)

  // console.log(typeof Number(req.body.limitSeniorTrend))
})

app.post('/alexPage', async function (req, res) {
  console.log('Alex: прилетел запрос на сервер:')
  console.table(req.body)

  const result = await startAlex(
    req.body.symbol,
    req.body.timeFrame,
    req.body.dateStart,
    req.body.dateFinish,
    req.body.deposit,
    req.body.partOfDeposit,
    req.body.multiplier,
    req.body.diffVolume,
    req.body.takeProfit,
    req.body.stopLoss,
    req.body.diffShadow35big, // стратегия 3.5
    req.body.diffShadow35small, // стратегия 3.5
    req.body.delta // стратегия 3.7
  )
  res.json(result)
})

// тесты функций: get24, exchange info
/*
app.post('/testPage', async function (req, res) {
  console.log('test: прилетел запрос на сервер:')
  // console.table(req.body)

  const result = await testFunctionBinance()
  console.log('app отработало')
  res.json(result)
})
*/

// попытка прикрутить обработку POST запроса в express

// создаем парсер для данных application/x-www-form-urlencoded
/*
const urlencodedParser = express.urlencoded({ extended: false })

app.post('/', urlencodedParser, function (request, response) {
  if (!request.body) return response.sendStatus(400)
  console.log(request.body)
  //response.send(`${request.body.userName} - ${request.body.userAge}`)
})
*/

// вариант № 2
/*
// const { response } = require('express')
// import startProgram2 from './engineByWilliamFractals'
const http = require('http')
// const url = require('url')
const config = require('config')
// const { startProgram2 } = require('./engineByWilliamFractals')
const startProgram2 = require('./engineByWilliamFractals')
// import { startProgram2 } from './engineByWilliamFractals'
// const ppp = require('./engineByWilliamFractals')
// const { parse } = require('path')

const PORT = config.get('port') || 5000

// взято из https://youtu.be/YMJDUHUccvA
const server = http.createServer((request, response) => {
  //response.end('ok')
  if (request.method == 'POST') {
    let body = ''
    request.on('data', (chunk) => {
      body += chunk.toString()
    })
    request.on('end', () => {
      let params = JSON.parse(body)
      // console.log(body)
      // console.log(params)
      // console.log(`symbol = ${params.symbol}, seniorTimeFrame = ${params.seniorTimeFrame}, lowerTimeFrame = ${params.lowerTimeFrame}`)
      startProgram2(
        params.symbol,
        params.seniorTimeFrame,
        params.lowerTimeFrame
      )
      response.end('ok2')
    })
  }
})

server.listen(PORT, () => {
  console.log(`Server has been started on ${PORT}...`)
})
*/
