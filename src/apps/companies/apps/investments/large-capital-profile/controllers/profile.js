const renderProfile = async (req, res, next) => {
  const { company, returnUrl, dnbRelatedCompaniesCount } = res.locals

  try {
    res.locals.title = `Large capital profile - ${company.name} - Companies`
    res.render(
      'companies/apps/investments/large-capital-profile/views/profile',
      {
        props: {
          companyId: company.id,
          returnUrl,
          dnbRelatedCompaniesCount,
          localNavItems: res.locals.localNavItems,
          companyId: company.id,
        },
      }
    )
  } catch (error) {
    next(error)
  }
}

module.exports = renderProfile
