// по видео Владилена Минина
/*
const express = require('express')
const config = require('config')

const app = express()

app.use(express.json({ extended: true }))

//app.use('/api/userrequest', require('./routes/symbol.TF'))
app.use('/', require('./routes/symbol.TF'))

const PORT = config.get('port') || 5000

async function start() {
  try {
    // подключаемся к базе данных
    app.listen(PORT, () =>
      console.log(`App has been started on port ${PORT}...`)
    )
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()
*/

/*
app.post('/', function (req, res) {
  console.log(req.query)
  res.send('1')
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

// const { response } = require('express')
const http = require('http')
// const url = require('url')
const config = require('config')
// const { startProgram2 } = require('./engineByWilliamFractals')
const startProgram2 = require('./engineByWilliamFractals')
// import { startProgram2 } from './engineByWilliamFractals'
const ppp = require('./engineByWilliamFractals')
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
