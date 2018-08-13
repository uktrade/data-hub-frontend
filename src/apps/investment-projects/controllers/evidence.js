const { getEvidenceForInvestment } = require('../../evidence/repos')
const {
  transformEvidenceToListItem,
} = require('../../evidence/transformers')

async function renderEvidenceView (req, res, next) {
  console.log('>>>s>e>c>s>>> ')

  try {
    const token = req.session.token
    const investmentId = req.params.investmentId

    const evidence = await getEvidenceForInvestment(token, investmentId)

    //   .then(
    //   (response) => transformEvidenceToListItem(response)
    // )

    console.log('>>>>>>>>>>>>>')

    return res
      .breadcrumb('Evidence')
      .render('investment-projects/views/evidence', {
        evidence,
        // actionButtons: [{
        //   label: 'Add evidence',
        //   url: `/investment-projects/${investmentId}/propositions/create/evidence`,
        // }],
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderEvidenceView,
  renderAddNewEvidenceView,
}
