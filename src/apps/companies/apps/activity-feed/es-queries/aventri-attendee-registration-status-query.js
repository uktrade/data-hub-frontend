const aventriAttendeeRegistrationStatusQuery = ({
  eventId,
  registrationStatuses,
}) => ({
  size: 0,
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
  aggs: {
    countfield: {
      terms: { field: 'object.dit:registrationStatus' },
    },
  },
})

module.exports = { aventriAttendeeRegistrationStatusQuery }
