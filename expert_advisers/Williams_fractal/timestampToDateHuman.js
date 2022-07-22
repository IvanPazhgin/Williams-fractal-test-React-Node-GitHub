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

module.exports = timestampToDateHuman
