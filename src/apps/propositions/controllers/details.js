const { lowerCase, capitalize } = require('lodash')

function renderDetailsPage(req, res, next) {
  try {
    const { proposition } = res.locals
    const breadcrumb = capitalize(lowerCase(proposition.name))
    return res.breadcrumb(breadcrumb).render('propositions/views/details', {
      props: {
        propositionId: proposition.id,
        investmentProjectId: proposition.investment_project.id,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderDetailsPage,
}
