const exportSupportServiceQuery = (from, size, contacts) => {
  return {
    from,
    size,
    query: {
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
    },
  }
}
module.exports = exportSupportServiceQuery
