const aventriAttendeeQuery = (eventId) => ({
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
      ],
    },
  },
})

module.exports = { aventriAttendeeQuery }
