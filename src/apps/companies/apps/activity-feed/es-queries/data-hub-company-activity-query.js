const { sortCriteria } = require('./sortCriteria')
const {
  DATA_HUB_ACTIVITY,
  EXTERNAL_ACTIVITY,
  FILTER_FEED_TYPE,
  FILTER_KEYS,
} = require('../constants')

const isInternalActivityFilter = (activityType) => {
  return activityType.includes(FILTER_KEYS.dataHubActivity)
}

const isExternalActivityFilter = (activityType) => {
  return activityType.includes(FILTER_KEYS.externalActivity)
}

const dataHubCompanyActivityQuery = ({
  from,
  size,
  companyIds,
  aventriEventIds,
  contacts,
  ditParticipantsAdviser,
  activityType,
  feedType,
}) => {
  let sortDirection = 'desc'
  let shouldCriteria = []
  let types = []
  if (activityType?.length == 0) {
    activityType = [FILTER_KEYS.dataHubActivity, FILTER_KEYS.externalActivity]
  }
  if (isInternalActivityFilter(activityType)) {
    types = [...types, ...DATA_HUB_ACTIVITY]
  }
  if (isExternalActivityFilter(activityType)) {
    types = [...types, ...EXTERNAL_ACTIVITY]
  }

  let dataHubActivityCriteria = {
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
  if (ditParticipantsAdviser.length) {
    dataHubActivityCriteria.bool.must.push({
      term: {
        'object.attributedTo.id': `dit:DataHubAdviser:${ditParticipantsAdviser}`,
      },
    })
  }
  shouldCriteria.push(dataHubActivityCriteria)

  if (isExternalActivityFilter(activityType)) {
    let externalActivityCriteria = {
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
    if (ditParticipantsAdviser.length) {
      externalActivityCriteria.bool.must.push({
        term: {
          'object.attributedTo.id': `dit:DataHubAdviser:${ditParticipantsAdviser}`,
        },
      })
    }
    shouldCriteria.push(externalActivityCriteria)
  }

  if (isInternalActivityFilter(activityType)) {
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
      if (ditParticipantsAdviser.length) {
        criteria.bool.must.push({
          term: {
            'object.attributedTo.id': `dit:DataHubAdviser:${ditParticipantsAdviser}`,
          },
        })
      }
      shouldCriteria.push(criteria)
    }
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
    if (ditParticipantsAdviser.length) {
      criteria.bool.must.push({
        term: {
          'object.attributedTo.id': `dit:DataHubAdviser:${ditParticipantsAdviser}`,
        },
      })
    }
    shouldCriteria.push(criteria)
  }

  let filters = []
  if (feedType && feedType != FILTER_FEED_TYPE.ALL) {
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
