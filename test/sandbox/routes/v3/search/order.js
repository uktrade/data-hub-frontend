var emptyOrder = require('../../../fixtures/v3/search/emptyOrder.json')
var order = require('../../../fixtures/v3/search/order.json')
var filteredOrders = require('../../../fixtures/v3/search/filter/order-filter')

var NORTH_WEST_REGION = '824cd12a-6095-e211-a939-e4115bead28a'

exports.order = function (req, res) {
  if (req.body.company === '375094ac-f79a-43e5-9c88-059a7caa17f0') {
    return res.json(order)
  }
  if (
    // uk_region can be a string or an array of strings so we need to unify it
    // to allow the filter to work also when there are multiple regions selected.
    _([req.body.uk_region]).flatten().indexOf(NORTH_WEST_REGION) >= 0 ||
    _([req.body.status]).flatten().indexOf('quote_accepted') >= 0
  ) {
    return res.json(filteredOrders)
  }
  res.json(emptyOrder)
}
