var advisers = require('../../../fixtures/v4/search/advisers.json')

exports.advisers = function (req, res) {
  return res.json(advisers)
}
