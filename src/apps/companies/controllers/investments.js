const { getCompanyInvestmentProjects } = require('../../investment-projects/repos')
const { transformInvestmentProjectToListItem } = require('../../investment-projects/transformers')
const { transformApiResponseToCollection } = require('../../../modules/api/transformers')

async function renderInvestments (req, res, next) {
  const { token } = req.session
  const { company } = res.locals
  const page = req.query.page || 1
  const view = company.duns_number ? 'companies/views/investments' : 'companies/views/_deprecated/investments'
  const actionButtons = company.archived ? undefined : [{
    label: 'Add investment project',
    url: `/investments/projects/create/${company.id}`,
  }]

  try {
    const results = await getCompanyInvestmentProjects(token, company.id, page)
      .then(transformApiResponseToCollection(
        { query: req.query },
        transformInvestmentProjectToListItem,
      ))

    res
      .breadcrumb(company.name, `/companies/${company.id}`)
      .breadcrumb('Investment')
      .render(view, {
        results,
        actionButtons,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInvestments,
}
