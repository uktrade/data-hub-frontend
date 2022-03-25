const contactActivityQuery = (email, contactId, objectTypes) => {
  return {
    size: 10,
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
                          'object.dit:emailAddress': email,
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
          order: 'desc',
          unmapped_type: 'long',
        },
      },
    ],
  }
}

module.exports = {
  contactActivityQuery,
}
