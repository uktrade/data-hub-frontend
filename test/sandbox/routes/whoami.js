var whoami = require('../fixtures/whoami.json')

exports.whoami = function (req, res) {
  res.json(whoami)
}
