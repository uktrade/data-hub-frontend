import eventById from '../../../fixtures/v3/event/single-event.json' with { type: 'json' }
import missingTeams from '../../../fixtures/v3/event/single-event-missing-teams.json' with { type: 'json' }
import emptyEvent from '../../../fixtures/v3/event/empty-event.json' with { type: 'json' }
import disabledEvent from '../../../fixtures/v3/event/disable-event.json' with { type: 'json' }
import eventCreate from '../../../fixtures/v4/event/event-create.json' with { type: 'json' }

function _getEventById(res, req) {
  var events = {
    'b93d4273-36fe-4008-ac40-fbc197910791': emptyEvent,
    'b93d4274-36fe-4008-ac40-fbc197910792': disabledEvent,
    '8253a4d2-0a61-4928-80cb-ebd70cce9971': eventById,
    '777f73a6-5d95-e211-aaaa-e4115bead28b': missingTeams,
  }
  return res.status(200).json(events[req.params.eventId] || eventById)
}

export const getEventById = function (req, res) {
  return _getEventById(res, req)
}

export const createEvent = function (req, res) {
  return res.status(201).json(eventCreate)
}

export const patchEvent = function (req, res) {
  return _getEventById(res, req)
}
