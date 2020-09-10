const {
  getCompanyInvestmentProjects,
} = require('../../../../../investments/repos')
const {
  transformInvestmentProjectToListItem,
} = require('../../../../../investments/transformers')
const {
  transformApiResponseToCollection,
} = require('../../../../../../modules/api/transformers')
const urls = require('../../../../../../lib/urls')

async function renderProjects(req, res, next) {
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
      req,
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
          { link: urls.dashboard(), text: 'Home' },
          { link: urls.companies.index(), text: 'Companies' },
          { link: urls.companies.detail(company.id), text: company.name },
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
