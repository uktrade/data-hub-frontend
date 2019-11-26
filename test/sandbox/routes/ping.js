var healthcheck = require('../fixtures/ping.js')

exports.ping = function (req, res) {
  res.send(healthcheck.ping)
}
