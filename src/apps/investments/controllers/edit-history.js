const { getInvestmentProjectAuditLog } = require('../repos')
const { transformAuditLog } = require('../transformers/edit-history')

const fetchProjectsHistoryHandler = async (req, res, next) => {
  try {
    const { page } = req.query

    const { results, count } = await getInvestmentProjectAuditLog(
      req,
      req.params.investmentId,
      page
    )

    res.json({
      results: transformAuditLog(results),
      count,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  fetchProjectsHistoryHandler,
}
