const dataHubActivity = ({ from, size, types, companyIds }) => {
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

module.exports = dataHubActivity
