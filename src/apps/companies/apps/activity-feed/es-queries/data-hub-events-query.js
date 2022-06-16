const dataHubEventsQuery = () => {
  return {
    query: {
      bool: {
        must: [
          {
            term: {
              'object.type': 'dit:Event',
            },
          },
        ],
      },
    },
  }
}

module.exports = {
  dataHubEventsQuery,
}
