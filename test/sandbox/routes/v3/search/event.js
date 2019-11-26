var events = require('../../../fixtures/v3/search/events.json')

exports.events = function (req, res) {
  res.json(events)
}
