const aventriAttendeeQuery = ({
  eventId,
  sort,
  from,
  registrationStatuses,
}) => ({
  from,
  query: {
    bool: {
      must: [
        {
          term: {
            'object.type': 'dit:aventri:Attendee',
          },
        },
        {
          term: {
            'object.attributedTo.id': `dit:aventri:Event:${eventId}`,
          },
        },
        {
          terms: {
            'object.dit:registrationStatus': registrationStatuses,
          },
        },
      ],
    },
  },
  sort,
})

module.exports = { aventriAttendeeQuery }
