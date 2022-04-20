const aventriEventQuery = (eventIds) => {
  return {
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
  }
}

module.exports = {
  aventriEventQuery,
}
