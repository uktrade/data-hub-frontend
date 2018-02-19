const { includes, isUndefined, find, get } = require('lodash')

const {
  transformCompanyToView,
  transformCompaniesHouseToView,
  transformCompanyToOneListView,
} = require('../transformers')

function renderDetails (req, res) {
  const company = res.locals.company

  // Sets up the link for headquarters in the company summary
  const companySubsidiarySessionStore = find(req.session.subsidiaries, (sessionCompany) => {
    return includes(sessionCompany.subs, company.id)
  })

  if (isUndefined(get(company, 'headquarter_type.name'))) {
    company.headquarters = !isUndefined(companySubsidiarySessionStore) ? {
      type: companySubsidiarySessionStore.headquarter_type.name,
      name: companySubsidiarySessionStore.name,
      url: `/companies/${companySubsidiarySessionStore.id}`,
      actions: [
        {
          label: 'Remove link',
          url: `/companies/${company.id}/details/global-headquarters/unlink/${companySubsidiarySessionStore.id}`,
        },
      ],
    } : {
      name: 'Link the Global HQ',
      url: `/companies/${company.id}/details/global-headquarters/add`,
    }
  }

  res
    .breadcrumb(company.name)
    .render('companies/views/details', {
      companyDetails: transformCompanyToView(company),
      accountManagementDetails: transformCompanyToOneListView(company),
      chDetails: company.companies_house_data ? transformCompaniesHouseToView(company.companies_house_data) : null,
    })
}

module.exports = {
  renderDetails,
}
