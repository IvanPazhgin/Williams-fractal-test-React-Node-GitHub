// = User.js
const ur = {
  symbol: { type: String, required: true, unique: true },
  seniorTimeFrame: { type: String, required: true },
  lowerTimeFrame: { type: String, required: true },
}

module.exports = ur
