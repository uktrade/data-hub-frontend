const { sortCriteria } = require('./sortCriteria')

const externalActivityQuery = ({
  from,
  size,
  types,
  companyIds,
  contacts,
  aventriEventIds,
  getEssInteractions,
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
    {
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
    sort: sortCriteria('desc'),
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

module.exports = externalActivityQuery
