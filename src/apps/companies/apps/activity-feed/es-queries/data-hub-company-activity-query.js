const { sortCriteria } = require('./sortCriteria')
const {
  FILTER_FEED_TYPE,
  DATA_HUB_ACTIVITY,
  FILTER_KEYS,
  DATA_HUB_AND_EXTERNAL_ACTIVITY,
} = require('../constants')

const dataHubCompanyActivityQuery = ({
  from,
  size,
  activityTypeFilter,
  companyIds,
  aventriEventIds,
  getEssInteractions,
  contacts,
  dit_participants__adviser,
  feedType = FILTER_FEED_TYPE.ALL,
}) => {
  let sortDirection = 'desc'
  let shouldCriteria = []
  let types = DATA_HUB_AND_EXTERNAL_ACTIVITY
  if (activityTypeFilter.includes(FILTER_KEYS.myActivity)) {
    types = [...types, ...DATA_HUB_ACTIVITY]
  }
  // console.log(activityTypeFilter)
  // console.log(types)
  // if (
  //   activityTypeFilter.includes(FILTER_KEYS.dataHubActivity) ||
  //   activityTypeFilter.includes(FILTER_KEYS.externalActivity)
  // ) {
  let criteria = {
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
  }
  if (dit_participants__adviser.length) {
    criteria.bool.must.push({
      term: {
        'object.attributedTo.id': `dit:DataHubAdviser:${dit_participants__adviser}`,
      },
    })
  }
  shouldCriteria.push(criteria)
  // }
  // if (activityTypeFilter.includes(FILTER_KEYS.externalActivity)) {
  criteria = {
    bool: {
      must: [
        {
          term: {
            // Great.gov.uk forms
            'object.type': 'dit:directoryFormsApi:Submission',
          },
        },
        {
          term: {
            // JSON format (Note: there two other formats HTML and Text)
            'object.attributedTo.type':
              'dit:directoryFormsApi:SubmissionAction:gov-notify-email',
          },
        },
        {
          term: {
            // For now, we only care about `Export enquiry` forms
            'object.url': '/contact/export-advice/comment/',
          },
        },
        {
          // Match a Data Hub company contact to the user filling out the form at Great.gov.uk
          terms: {
            'actor.dit:emailAddress': [
              ...contacts.map((contact) => contact.email),
            ],
          },
        },
      ],
    },
  }
  if (dit_participants__adviser.length) {
    criteria.bool.must.push({
      term: {
        'object.attributedTo.id': `dit:DataHubAdviser:${dit_participants__adviser}`,
      },
    })
  }
  shouldCriteria.push(criteria)
  // }

  if (aventriEventIds?.length) {
    let criteria = {
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
    }
    if (dit_participants__adviser.length) {
      criteria.bool.must.push({
        term: {
          'object.attributedTo.id': `dit:DataHubAdviser:${dit_participants__adviser}`,
        },
      })
    }
    shouldCriteria.push(criteria)
  }
  if (getEssInteractions) {
    let criteria = {
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
    }
    if (dit_participants__adviser.length) {
      criteria.bool.must.push({
        term: {
          'object.attributedTo.id': `dit:DataHubAdviser:${dit_participants__adviser}`,
        },
      })
    }
    shouldCriteria.push(criteria)
  }

  let filters = []
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
    filters.push(dateFilter)
  }
  shouldCriteria.map(
    (criteria) => (criteria.bool.must = [...criteria.bool.must, ...filters])
  )

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

module.exports = dataHubCompanyActivityQuery
