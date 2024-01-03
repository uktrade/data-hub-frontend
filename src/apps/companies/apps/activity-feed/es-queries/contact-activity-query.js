const { sortCriteria } = require('./sortCriteria')

const contactActivityQuery = (
  from,
  size,
  email,
  contactId,
  objectTypes,
  sortOrder
) => {
  return {
    from,
    size,
    sort: sortCriteria(sortOrder),
    query: {
      bool: {
        must: [
          {
            bool: {
              should: [
                {
                  bool: {
                    must: [
                      {
                        terms: {
                          'object.type': objectTypes,
                        },
                      },
                      {
                        terms: {
                          'object.attributedTo.id': [
                            `dit:DataHubContact:${contactId}`,
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
                          'object.type': 'dit:aventri:Attendee',
                        },
                      },
                      {
                        term: {
                          'object.dit:emailAddress': {
                            value: email,
                            case_insensitive: true,
                          },
                        },
                      },
                      {
                        terms: {
                          'object.dit:registrationStatus': [
                            'Attended',
                            'Confirmed',
                            'Cancelled',
                            'Registered',
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
                          'object.attributedTo.id':
                            'dit:directoryFormsApi:SubmissionType:export-support-service',
                        },
                      },
                      {
                        term: {
                          'actor.dit:emailAddress': {
                            value: email,
                            case_insensitive: true,
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  }
}

module.exports = {
  contactActivityQuery,
}
