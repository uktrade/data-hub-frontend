const {
  getCompanyInvestmentProjects,
} = require('../../../../../investments/repos')
const {
  transformInvestmentProjectToListItem,
} = require('../../../../../investments/transformers')
const {
  transformApiResponseToCollection,
} = require('../../../../../../modules/api/transformers')
const { companies, dashboard } = require('../../../../../../lib/urls')

async function renderProjects(req, res, next) {
  const { token } = req.session
  const { company, returnUrl, dnbRelatedCompaniesCount } = res.locals
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

    res.render('companies/apps/investments/projects/views/list', {
      results,
      actionButtons,
      props: {
        company,
        breadcrumbs: [
          { link: dashboard(), text: 'Home' },
          { link: companies.index(), text: 'Companies' },
          { link: companies.detail(company.id), text: company.name },
          { text: 'Investment' },
        ],
        returnUrl,
        dnbRelatedCompaniesCount,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = renderProjects
