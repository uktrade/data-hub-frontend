import eventByIdJson from '../../../fixtures/v3/event/single-event.json' assert { type: 'json' };
import missingTeamsJson from '../../../fixtures/v3/event/single-event-missing-teams.json' assert { type: 'json' };
import emptyEventJson from '../../../fixtures/v3/event/empty-event.json' assert { type: 'json' };
import disabledEventJson from '../../../fixtures/v3/event/disable-event.json' assert { type: 'json' };

export const eventById = function (req, res) {
  var events = {
    'b93d4273-36fe-4008-ac40-fbc197910791': emptyEventJson,
    'b93d4274-36fe-4008-ac40-fbc197910792': disabledEventJson,
    '8253a4d2-0a61-4928-80cb-ebd70cce9971': eventByIdJson,
    '777f73a6-5d95-e211-aaaa-e4115bead28b': missingTeamsJson,
  }

  res.json(events[req.params.eventId] || eventByIdJson)
};
