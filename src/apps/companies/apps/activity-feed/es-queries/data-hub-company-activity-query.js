const { sortCriteria } = require('./sortCriteria')
const { datePeriodFilter } = require('./datePeriodFilter')
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

function addFiltersToCriteria(filters, criteria) {
  if (filters.must.length) {
    if (!criteria.bool.must) criteria.bool.must = []
    criteria.bool.must = [...criteria.bool.must, ...filters.must]
  }
  if (filters.must_not.length) {
    if (!criteria.bool.must_not) criteria.bool.must_not = []
    criteria.bool.must_not = [...criteria.bool.must_not, ...filters.must_not]
  }
  return criteria
}

const dataHubCompanyActivityQuery = ({
  from,
  size,
  companyIds,
  aventriEventIds,
  contacts,
  dateBefore = null,
  dateAfter = null,
  ditParticipantsAdviser,
  createdByOthers = null,
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

  if (
    createdByOthers?.length &&
    ditParticipantsAdviser.length &&
    ditParticipantsAdviser.includes(createdByOthers[0])
  ) {
    ditParticipantsAdviser.splice(
      ditParticipantsAdviser.indexOf(createdByOthers),
      1
    )
    createdByOthers = null
  }
  const dataHubActivityCriteria = {
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
  shouldCriteria.push(dataHubActivityCriteria)

  if (isExternalActivityFilter(activityType)) {
    const externalActivityCriteria = {
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
    shouldCriteria.push(externalActivityCriteria)
  }

  if (isInternalActivityFilter(activityType)) {
    if (aventriEventIds?.length) {
      const criteria = {
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
      shouldCriteria.push(criteria)
    }
    const criteria = {
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
    shouldCriteria.push(criteria)
  }

  const filters = { must: [], must_not: [] }
  if (feedType && feedType != FILTER_FEED_TYPE.ALL) {
    const now = new Date()
    switch (feedType) {
      case FILTER_FEED_TYPE.RECENT:
        dateBefore = now
        break
      case FILTER_FEED_TYPE.UPCOMING:
        sortDirection = 'asc'
        dateAfter = now
        break
    }
  }
  if (dateAfter || dateBefore) {
    const dateFilter = datePeriodFilter(dateAfter, dateBefore)
    filters.must.push(dateFilter)
  }
  if (ditParticipantsAdviser?.length) {
    filters.must.push({
      term: {
        'object.attributedTo.id': `dit:DataHubAdviser:${ditParticipantsAdviser}`,
      },
    })
  }
  if (createdByOthers?.length) {
    filters.must_not.push({
      term: {
        'object.attributedTo.id': `dit:DataHubAdviser:${createdByOthers}`,
      },
    })
  }
  shouldCriteria.map((criteria) => {
    return addFiltersToCriteria(filters, criteria)
  })

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
