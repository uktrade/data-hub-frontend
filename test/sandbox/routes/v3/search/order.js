const orders = require('../../../fixtures/v3/search/order.json')

exports.order = function (req, res) {
  res.json(orders)
}
