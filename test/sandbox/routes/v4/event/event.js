import eventByIdJson from '../../../fixtures/v3/event/single-event.json' assert { type: 'json' };
import missingTeams from '../../../fixtures/v3/event/single-event-missing-teams.json' assert { type: 'json' };
import emptyEvent from '../../../fixtures/v3/event/empty-event.json' assert { type: 'json' };
import disabledEvent from '../../../fixtures/v3/event/disable-event.json' assert { type: 'json' };
import eventCreate from '../../../fixtures/v4/event/event-create.json' assert { type: 'json' };

function getEventById(res, req) {
  var events = {
    'b93d4273-36fe-4008-ac40-fbc197910791': emptyEvent,
    'b93d4274-36fe-4008-ac40-fbc197910792': disabledEvent,
    '8253a4d2-0a61-4928-80cb-ebd70cce9971': eventByIdJson,
    '777f73a6-5d95-e211-aaaa-e4115bead28b': missingTeams,
  }
  return res.status(200).json(events[req.params.eventId] || eventByIdJson)
}

export const eventById = function (req, res) {
  return getEventById(res, req)
};

export const createEvent = function (req, res) {
  return res.status(201).json(eventCreate)
};

export const patchEvent = function (req, res) {
  return getEventById(res, req)
};
