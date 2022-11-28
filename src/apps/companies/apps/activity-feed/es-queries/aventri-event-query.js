const aventriEventQuery = (eventId) => ({
  query: {
    bool: {
      must: [
        {
          term: {
            'object.type': 'dit:aventri:Event',
          },
        },
        {
          terms: {
            id: eventId,
          },
        },
      ],
    },
  },
})

module.exports = {
  aventriEventQuery,
}
