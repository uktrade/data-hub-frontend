const activityFeedEventsQuery = () => {
    return {
        size: 20,
        query: {
            bool: {
                must: [
                    {
                        terms: {
                            'object.type': ['dit:aventri:Event', 'dit:dataHub:Event'],
                        },
                    },
                ],
            },
        }
    }
}

module.exports = activityFeedEventsQuery
