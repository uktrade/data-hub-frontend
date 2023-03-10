const dataHubAndActivityStreamServicesQuery = ({
  from,
  size,
  types,
  companyIds,
  aventriEventIds,
  getEssInteractions,
  contacts,
}) => {
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
    sort: {
      _script: {
        type: 'number',
        script: {
          lang: 'painless',
          // Using the logic below to perform sorting, as we want to sort on published time, apart from events, which
          // have a startTime set. The sort order needs to reflect their startTime (i.e. when the event is happening)
          // in the list of activities, as opposed to when that activity was created.
          source:
            "doc.containsKey('object.startTime') ? doc['object.startTime'].value.toInstant().toEpochMilli() " +
            ": doc['published'].value.toInstant().toEpochMilli()",
        },
        order: 'desc',
      },
    },
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
