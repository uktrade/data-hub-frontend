const aventriAttendeeQuery = ({ eventId, sort }) => ({
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
  sort,
})

module.exports = { aventriAttendeeQuery }
