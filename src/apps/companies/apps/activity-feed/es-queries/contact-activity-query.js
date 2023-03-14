const sortCriteria = (sortOrder) => {
  return {
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
      order: `${sortOrder}`,
    },
  }
}

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
                        terms: {
                          'object.type': [
                            'dit:aventri:Attendee',
                            'dit:maxemail:Email:Sent',
                          ],
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
                        term: { 'actor.dit:emailAddress': email },
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
