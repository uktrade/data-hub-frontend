var myTasks = require('../../../fixtures/v4/search/myTasks.json')

exports.myTasks = function (req, res) {
  return res.json(myTasks)
}
