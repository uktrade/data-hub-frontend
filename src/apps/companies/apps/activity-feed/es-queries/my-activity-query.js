const { sortCriteria } = require('./sortCriteria')

const myActivityQuery = ({ from, size, types, user, companyIds }) => {
  return {
    from,
    size,
    sort: sortCriteria('desc'),
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
