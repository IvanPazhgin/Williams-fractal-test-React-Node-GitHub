// npm i express <ok> mongoose
// npm i -D  nodemon <ok> concurrently <ok> (concurrently - для запуска frontend и backend)
// npm i config <ok>
// npm i bcryptjs
// npm i express-validator <ok>
// npx create-react-app client <ok> (client - папка для размещения)
// rm -rf node_modules/ <ok> (in folder "client")
// in "client": npm i (чтобы заново скачать всю папку node_modules)

const express = require('express')
const config = require('config')

const app = express()

app.use('/api/userrequest', require('./routes/symbol.TF'))

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
