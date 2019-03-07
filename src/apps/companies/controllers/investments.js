const { getCompanyInvestmentProjects } = require('../../investments/repos')
const { transformInvestmentProjectToListItem } = require('../../investments/transformers')
const { transformApiResponseToCollection } = require('../../../modules/api/transformers')

async function renderInvestments (req, res, next) {
  const { token } = req.session
  const { company, features } = res.locals
  const view = (company.duns_number || features['companies-new-layout'])
    ? 'companies/views/investments'
    : 'companies/views/_deprecated/investments'
  const actionButtons = company.archived ? undefined : [{
    label: 'Add investment project',
    url: `/investments/projects/create/${company.id}`,
  }]

  try {
    const results = await getCompanyInvestmentProjects(token, company.id, req.query.page)
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
