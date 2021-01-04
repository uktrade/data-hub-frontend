const maxemailEmailSentQuery = (contacts) => {
  return {
    query: {
      bool: {
        must: [
          {
            term: {
              'object.type': 'dit:maxemail:Email:Sent',
            },
          },
          {
            bool: {
              should: [
                {
                  terms: {
                    'object.dit:emailAddress': [
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
  }
}

module.exports = maxemailEmailSentQuery
