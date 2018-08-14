const { getEvidenceForInvestment } = require('../../evidence/repos')
const {
} = require('../../evidence/transformers')

async function renderEvidenceView (req, res, next) {

  try {
    const token = req.session.token
    const investmentId = req.params.investmentId
    const evidence = await getEvidenceForInvestment(token, investmentId)

    return res
      .breadcrumb('Evidence')
      .render('investment-projects/views/evidence', {
        evidence,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderEvidenceView,
}
