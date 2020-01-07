const {
  getCompanyInvestmentProjects,
} = require('../../../../../investments/repos')
const {
  transformInvestmentProjectToListItem,
} = require('../../../../../investments/transformers')
const {
  transformApiResponseToCollection,
} = require('../../../../../../modules/api/transformers')

async function renderProjects(req, res, next) {
  const { token } = req.session
  const { company } = res.locals
  const actionButtons = company.archived
    ? undefined
    : [
        {
          label: 'Add investment project',
          url: `/investments/projects/create/${company.id}`,
        },
      ]

  try {
    const results = await getCompanyInvestmentProjects(
      token,
      company.id,
      req.query.page
    ).then(
      transformApiResponseToCollection(
        { query: req.query },
        transformInvestmentProjectToListItem
      )
    )

    res
      .breadcrumb(company.name, `/companies/${company.id}`)
      .breadcrumb('Investment')
      .render('companies/apps/investments/projects/views/list', {
        results,
        actionButtons,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = renderProjects
