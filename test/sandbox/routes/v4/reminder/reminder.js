var summary = require('../../../fixtures/v4/reminder/summary.json')
var myTasksDueDateApproaching = require('../../../fixtures/v4/reminder/my-tasks-due-date-approaching.json')

exports.summary = function (req, res) {
  res.json(summary)
}

exports.myTasksDueDateApproaching = function (req, res) {
  res.json(myTasksDueDateApproaching)
}
