var eventById = require('../../../fixtures/v3/event/single-event.json')
var emptyEvent = require('../../../fixtures/v3/event/empty-event.json')
var disabledEvent = require('../../../fixtures/v3/event/disable-event.json')
var eventCreate = require('../../../fixtures/v4/event/event-create.json')

function getEventById(res, req) {
  var events = {
    'b93d4273-36fe-4008-ac40-fbc197910791': emptyEvent,
    'b93d4274-36fe-4008-ac40-fbc197910792': disabledEvent,
    '8253a4d2-0a61-4928-80cb-ebd70cce9971': eventById,
  }
  return res.json(200, events[req.params.eventId] || eventById)
}

exports.eventById = function (req, res) {
  return getEventById(res, req)
}

exports.createEvent = function (req, res) {
  return res.json(201, eventCreate)
}

exports.patchEvent = function (req, res) {
  return getEventById(res, req)
}
