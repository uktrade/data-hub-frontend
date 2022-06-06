const eventsActivityQuery = () => {
  return {
    from: 0,
    size: 50,
    query: {
      bool: {
        must: [
          {
            terms: {
              'object.type': ['dit:Event', 'dit:aventri:Event'],
            },
          },
        ],
        //we currently need to exclude interactions and service deliveries
        // because atm they also have type of dit:Event
        must_not: [
          {
            terms: {
              'object.type': ['dit:Interaction', 'dit:ServiceDelivery'],
            },
          },
        ],
      },
    },
    sort: [
      {
        published: {
          order: 'desc',
          unmapped_type: 'long',
        },
      },
    ],
  }
}

module.exports = {
  eventsActivityQuery,
}
