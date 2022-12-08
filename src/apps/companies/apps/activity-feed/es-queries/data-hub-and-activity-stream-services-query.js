const dataHubAndActivtyStreamServicesQuery = ({
  from,
  size,
  types,
  companyIds,
  aventriEventIds,
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
      bool: {
        must: [
          {
            term: {
              'object.attributedTo.id':
                'dit:directoryFormsApi:SubmissionType:export-support-service',
            },
          },
          {
            term: {
              'object.attributedTo.type':
                'dit:directoryFormsApi:SubmissionAction:zendesk',
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
  const dsl = {
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

module.exports = dataHubAndActivtyStreamServicesQuery
