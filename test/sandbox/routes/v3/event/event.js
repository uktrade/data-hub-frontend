var eventById = require('../../../fixtures/v3/event/single-event.json')
var emptyEvent = require('../../../fixtures/v3/event/empty-event.json')
var disabledEvent = require('../../../fixtures/v3/event/disable-event.json')

exports.eventById = function (req, res) {
  var events = {
    'b93d4273-36fe-4008-ac40-fbc197910791': emptyEvent,
    'b93d4274-36fe-4008-ac40-fbc197910792': disabledEvent,
    '8253a4d2-0a61-4928-80cb-ebd70cce9971': eventById,
  }

  res.json(events[req.params.eventId] || eventById)
}
