const exportServiceSupportQuery = (contacts) => {
    return {
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
            }
        }
    }
}
module.exports = exportServiceSupportQuery
