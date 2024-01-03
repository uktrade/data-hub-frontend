const exportSupportServiceDetailQuery = (essId) => {
  return {
    query: {
      bool: {
        must: [
          {
            term: {
              id: `dit:directoryFormsApi:Submission:${essId}:Create`,
            },
          },
        ],
      },
    },
  }
}
module.exports = exportSupportServiceDetailQuery
