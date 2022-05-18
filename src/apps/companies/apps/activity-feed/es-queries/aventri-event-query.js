const aventriEventQuery = (eventIds) => ({
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
            id: eventIds,
          },
        },
      ],
    },
  },
})

module.exports = {
  aventriEventQuery,
}
