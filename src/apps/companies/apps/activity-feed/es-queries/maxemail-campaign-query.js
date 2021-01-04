const maxemailCampaignQuery = (size = 20) => {
  return {
    size,
    sort: [
      {
        published: {
          order: 'desc',
        },
      },
    ],
    query: {
      term: {
        'object.type': 'dit:maxemail:Campaign',
      },
    },
  }
}

module.exports = maxemailCampaignQuery
