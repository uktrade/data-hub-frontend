const orders = require('../../../fixtures/v3/search/order.json')
const filteredOrders = require('../../../fixtures/v3/search/filter/order-filter')

exports.order = function (req, res) {
  // TODO: remove this when we get to replace the reconciliation
  // page using a Cypress intercept in its place
  if (_([req.body.status]).flatten().indexOf('quote_accepted') >= 0) {
    // reconciliation-spec.js
    return res.json(filteredOrders)
  }

  res.json(orders)
}
