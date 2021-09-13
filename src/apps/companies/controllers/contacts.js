const urls = require('../../../lib/urls')

function renderContacts(req, res) {
  const { company, returnUrl, dnbRelatedCompaniesCount } = res.locals

  res.locals.title = `Contacts - ${company.name} - Companies`

  res.render('companies/views/contacts', {
    props: {
      company,
      breadcrumbs: [
        { link: urls.dashboard(), text: 'Home' },
        { link: urls.companies.index(), text: 'Companies' },
        { link: urls.companies.detail(company.id), text: company.name },
        { text: 'Contacts' },
      ],
      returnUrl,
      dnbRelatedCompaniesCount,
    },
  })
}

module.exports = {
  renderContacts,
}
