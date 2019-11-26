var emptyOrder = require('../../../fixtures/v3/search/emptyOrder.json')
var order = require('../../../fixtures/v3/search/order.json')

exports.order = function (req, res) {
  if (req.body.company === '375094ac-f79a-43e5-9c88-059a7caa17f0') {
    return res.json(order)
  }
  res.json(emptyOrder)
}
