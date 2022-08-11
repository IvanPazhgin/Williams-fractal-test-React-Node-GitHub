function timestampToDateHuman(arg) {
  let dateTime = arg

  // проверяем на сервере разницу во времени
  const diff = new Date().getTimezoneOffset() // Возвращает разницу в минутах между UTC и местным часовым поясом
  if (diff == 0) {
    dateTime += 1000 * 60 * 60 * 3 // прибавляем 3 часа
  }

  let bbb = new Date(dateTime)

  const year = bbb.getFullYear()
  const month = bbb.getMonth() + 1
  const date = bbb.getDate()
  let hours = String(bbb.getHours())
  let minutes = String(bbb.getMinutes())
  let seconds = String(bbb.getSeconds())

  if (hours.length == 1) {
    hours = '0' + hours
  }
  if (minutes.length == 1) {
    minutes = '0' + minutes
  }
  if (seconds.length == 1) {
    seconds = '0' + seconds
  }

  return `${year}.${month}.${date} at ${hours}:${minutes}:${seconds}`
}

module.exports = timestampToDateHuman
