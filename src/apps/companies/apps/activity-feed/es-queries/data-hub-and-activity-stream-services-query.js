const { sortCriteria } = require('./sortCriteria')
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
  let sortDirection = 'desc'
  const shouldCriteria = [
    {
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

  if (feedType != FILTER_FEED_TYPE.ALL) {
    let now = new Date()
    let period
    switch (feedType) {
      case FILTER_FEED_TYPE.RECENT:
        period = 'isBefore'
        break
      case FILTER_FEED_TYPE.UPCOMING:
        sortDirection = 'asc'
        period = 'isAfter'
        break
    }
    const dateFilter = {
      script: {
        script: {
          lang: 'painless',
          source:
            "ZonedDateTime filterDateTime = (doc.containsKey('object.startTime') ? doc['object.startTime'].value : doc['object.published'].value); ZonedDateTime now = ZonedDateTime.parse(params['now']); return filterDateTime." +
            period +
            '(now)',
          params: {
            now: now.toISOString(),
          },
        },
      },
    }
    shouldCriteria.map((criteria) => criteria.bool.must.push(dateFilter))
  }
  const dsl = {
    from,
    size,
    sort: sortCriteria(sortDirection),
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
