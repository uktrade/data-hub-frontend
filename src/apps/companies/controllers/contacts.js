function renderContacts(req, res) {
  const { company, returnUrl, dnbRelatedCompaniesCount } = res.locals

  res.locals.title = `Contacts - ${company.name} - Companies`

  res.render('companies/views/contacts', {
    props: {
      company,
      companyId: company.id,
      returnUrl,
      dnbRelatedCompaniesCount,
      localNavItems: res.locals.localNavItems,
    },
  })
}

module.exports = {
  renderContacts,
}
