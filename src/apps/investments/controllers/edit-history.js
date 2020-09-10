const { investments } = require('../../../lib/urls')

const { getInvestmentProjectAuditLog } = require('../repos')
const { transformAuditLog } = require('../transformers/edit-history')

const renderProjectsView = (req, res) => {
  const { investment } = res.locals

  res.breadcrumb('Edit History').render('investments/views/edit-history', {
    props: {
      dataEndpoint: investments.editHistory.data(investment.id),
    },
  })
}

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
  renderProjectsView,
  fetchProjectsHistoryHandler,
}
