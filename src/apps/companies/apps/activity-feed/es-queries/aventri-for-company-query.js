const aventriForCompanyQuery = (contacts) => ({
  size: 20,
  query: {
    bool: {
      must: [
        {
          term: {
            'object.type': 'dit:aventri:Attendee',
          },
        },
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
  sort: {
    'object.updated': {
      order: 'desc',
      unmapped_type: 'date',
    },
  },
})

module.exports = aventriForCompanyQuery
