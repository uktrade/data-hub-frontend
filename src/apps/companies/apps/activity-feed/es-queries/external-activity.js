const externalActivity = ({ from, size, companyIds, contacts }, types) => {
  return {
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
            should: [
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
            ],
          },
        },
      },
    },
  }
}

module.exports = externalActivity
