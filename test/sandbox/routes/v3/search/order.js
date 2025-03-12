import orders from '../../../fixtures/v3/search/order.json' with { type: 'json' }

export const order = function (req, res) {
  res.json(orders)
}
