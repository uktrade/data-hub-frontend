const dataHubEventsQuery = () => ({
  query: {
    bool: {
      must: [
        {
          term: {
            'object.type': 'dit:dataHub:Event',
          },
        },
      ],
    },
  },
})

module.exports = dataHubEventsQuery
