const {
  symbolsPart1,
  symbolsPart2,
  nameStrategy,
  options,
  timeFrames,
} = require('./input_parameters')
const robotMain = require('./robot_main')

function robotStart() {
  //const timeFrames2 = [timeFrames.timeFrame1h]
  //const timeFrames2 = timeFrames.timeFrame1h
  robotMain(
    symbolsPart1,
    timeFrames.timeFrame1h,
    nameStrategy,
    options.takeProfitConst1h,
    options.stopLossConst1h,
    options.shiftTime1h
  )
}

module.exports = robotStart
