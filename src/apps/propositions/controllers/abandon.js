const { get } = require('lodash')

function renderAbandon(req, res) {
  const propositionId = get(res.locals, 'proposition.id')
  const investment_project = get(res.locals, 'investment.id')

  res
    .breadcrumb('Abandon Proposition')
    .render('propositions/views/abandon.njk', {
      props: {
        propositionId,
        investmentProjectId: investment_project,
      },
    })
}

module.exports = {
  renderAbandon,
}
