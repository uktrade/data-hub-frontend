const maxemailCampaignQuery = (campaignIds) => {
  return {
    sort: [
      {
        published: {
          order: 'desc',
        },
      },
    ],
    query: {
      bool: {
        must: [
          {
            term: {
              'object.type': 'dit:maxemail:Campaign',
            },
          },
          {
            terms: {
              id: campaignIds,
            },
          },
        ],
      },
    },
  }
}

module.exports = maxemailCampaignQuery
