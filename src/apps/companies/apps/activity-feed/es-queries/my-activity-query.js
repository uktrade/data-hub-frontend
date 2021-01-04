const myActivityQuery = ({ from, size, types, user, companyIds }) => {
  return {
    from,
    size,
    sort: [
      {
        'object.startTime': {
          order: 'desc',
        },
      },
    ],
    query: {
      bool: {
        must: [
          {
            terms: {
              'object.type': types,
            },
          },
          {
            term: {
              'object.attributedTo.id': `dit:DataHubAdviser:${user.id}`,
            },
          },
          {
            terms: {
              'object.attributedTo.id': [
                ...companyIds.map((id) => `dit:DataHubCompany:${id}`),
              ],
            },
          },
        ],
      },
    },
  }
}

module.exports = myActivityQuery
