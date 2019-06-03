const { fetchActivityFeed } = require('./repos')
const { transformActivityFeedSearchResults } = require('./transformers')

async function getActivityFeedHandler (req, res, next) {
  try {
    const { from = 0, company_id: companyId } = req.query

    const results = await fetchActivityFeed({
      token: req.session.token,
      from,
      companyId,
    })

    res.json(transformActivityFeedSearchResults(results))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getActivityFeedHandler,
}
