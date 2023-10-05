import orders from '../../../fixtures/v3/search/order.json' assert { type: 'json' };

export const order = function (req, res) {
  res.json(orders)
};
