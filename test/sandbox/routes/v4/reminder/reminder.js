var summary = require('../../../fixtures/v4/reminder/summary.json')

exports.summary = function (req, res) {
  res.json(summary)
}
