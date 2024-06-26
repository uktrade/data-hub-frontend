const { fetchActivityFeed } = require('./repos')

const { exportSupportServiceDetailQuery } = require('./es-queries')

async function fetchESSDetails(req, res, next) {
  try {
    const essInteractionId = req.params.essInteractionId
    const essQuery = exportSupportServiceDetailQuery(essInteractionId)

    const essInteractionResults = await fetchActivityFeed(req, essQuery)

    const essInteractionDetail = essInteractionResults.hits.hits.map(
      (hit) => hit._source
    )

    return res.json(...essInteractionDetail)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  fetchESSDetails,
}
