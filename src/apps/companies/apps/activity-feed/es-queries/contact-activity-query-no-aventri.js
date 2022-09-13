// to delete when contact feature flag is removed
const contactActivityQueryNoAventri = (
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
                          'object.type': 'dit:maxemail:Email:Sent',
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
              ],
            },
          },
        ],
      },
    },
    sort: [
      {
        published: {
          order: sortOrder,
          unmapped_type: 'long',
        },
      },
    ],
  }
}

module.exports = {
  contactActivityQueryNoAventri,
}
