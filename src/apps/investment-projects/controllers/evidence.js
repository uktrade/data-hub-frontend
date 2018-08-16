const { notFound } = require('../../../middleware/errors')
const { getEvidenceForInvestment } = require('../apps/evidence/repos')
const { transformEvidenceResponseToViewRecord } = require('../apps/evidence/transformers')

async function renderEvidenceView (req, res, next) {
  if (!res.locals.features['investment-evidence']) {
    return notFound(req, res, next)
  }

  try {
    const token = req.session.token
    const investmentId = req.params.investmentId
    const evidence = await getEvidenceForInvestment(token, investmentId)
    const evidenceViewRecord = transformEvidenceResponseToViewRecord(evidence)

    return res
      .breadcrumb('Evidence')
      .render('investment-projects/apps/evidence/views/list', {
        evidence,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderEvidenceView,
}
