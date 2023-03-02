const { FILTER_FEED_TYPE } = require('../constants')

const dataHubAndActivityStreamServicesQuery = ({
  from,
  size,
  types,
  companyIds,
  aventriEventIds,
  getEssInteractions,
  contacts,
  feedType = FILTER_FEED_TYPE.ALL,
}) => {
  const mustCriteria = [
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
  ]

  if (feedType != FILTER_FEED_TYPE.ALL) {
    if (feedType != FILTER_FEED_TYPE.UPCOMING) {
      mustCriteria.push({
        range: {
          'object.startTime': {
            lt: 'now/d',
          },
        },
      })
    } else {
      mustCriteria.push({
        range: {
          'object.startTime': {
            gte: 'now/d',
          },
        },
      })
    }
  }

  const shouldCriteria = [
    {
      bool: {
        must: mustCriteria,
      },
    },
  ]
  if (feedType != FILTER_FEED_TYPE.ALL) {
    // TODO Fix
    // shouldCriteria.push({
    //   bool: {
    //     must: [
    //       {
    //         range: {
    //           'object.startTime': {
    //             lte: 'now/d',
    //           },
    //         },
    //       },
    //     ],
    //   },
    // })
  }
  if (aventriEventIds?.length) {
    shouldCriteria.push({
      bool: {
        must: [
          {
            term: {
              'object.type': 'dit:aventri:Event',
            },
          },
          {
            terms: {
              id: aventriEventIds,
            },
          },
        ],
      },
    })
  }
  if (getEssInteractions) {
    shouldCriteria.push({
      bool: {
        must: [
          {
            term: {
              'object.attributedTo.id':
                'dit:directoryFormsApi:SubmissionType:export-support-service',
            },
          },
          {
            terms: {
              'actor.dit:emailAddress': [
                ...contacts.map((contact) => contact.email),
              ],
            },
          },
        ],
      },
    })
  }
  const dsl = {
    from,
    size,
    sort: [
      {
        'object.published': {
          order: 'desc',
        },
      },
      {
        'object.startTime': {
          order: 'desc',
        },
      },
    ],
    query: {
      bool: {
        filter: {
          bool: {
            should: shouldCriteria,
          },
        },
      },
    },
  }
  return dsl
}

module.exports = dataHubAndActivityStreamServicesQuery
