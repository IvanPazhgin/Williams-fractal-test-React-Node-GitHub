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
    case '1m':
      console.log('1m свечи')
      countOfCandles = diffday / 1000 / 60
      shiftOndeCandle = 60 * 1000
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

module.exports = diffCandle
