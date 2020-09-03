var eventById = require('../../../fixtures/v3/event/single-event.json')
var disabledEvent = require('../../../fixtures/v3/event/disable-event.json')

exports.eventById = function (req, res) {
  var events = {
    'b93d4273-36fe-4008-ac40-fbc197910791': eventById,
    'b93d4274-36fe-4008-ac40-fbc197910792': disabledEvent,
  }

  res.json(events[req.params.eventId] || eventById)
}
