const { getEvidenceForInvestment } = require('../apps/evidence/repos')

async function renderEvidenceView(req, res, next) {
  try {
    const token = req.session.token
    const investmentId = req.params.investmentId
    const evidence = await getEvidenceForInvestment(token, investmentId)

    return res
      .breadcrumb('Evidence')
      .render('investments/apps/evidence/views/list', {
        evidence,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderEvidenceView,
}
