const { getPropositionsForInvestment } = require('../../propositions/repos')
const {
  transformPropositionToListItem,
  transformPropositionListItemToHaveUrlPrefix,
} = require('../../propositions/transformers')
const { transformApiResponseToCollection } = require('../../transformers')

async function renderPropositionList (req, res, next) {

  console.log('}}}}}}}}}}}} investment propositions {{{{{{{{{{{{{{{{')
  try {
    const token = req.session.token
    const page = req.query.page || '1'
    const investmentId = req.params.investmentId

    const propositions = await getPropositionsForInvestment(token, investmentId, page)
      .then(transformApiResponseToCollection(
        { entityType: 'proposition' },
        transformPropositionToListItem,
        transformPropositionListItemToHaveUrlPrefix(res.locals.returnLink)
      ))

    return res
      .breadcrumb('Propositions')
      .render('investment-projects/views/propositions', {
        propositions,
        actionButtons: [{
          label: 'Add proposition',
          url: `/investment-projects/${investmentId}/propositions/create/proposition`,
        }],
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderPropositionList,
}
