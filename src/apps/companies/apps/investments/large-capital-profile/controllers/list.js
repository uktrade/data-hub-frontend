const { getCompanyProfiles } = require('../repos')

const renderLargeCapitalProfile = async (req, res, next) => {
  const token = req.session.token
  const { company } = res.locals

  try {
    const companyProfiles = await getCompanyProfiles(token, company.id)
    res.render('companies/apps/investments/large-capital-profile/views/list', {
      company,
      companyProfile: companyProfiles.results[0],
    })
  } catch (error) {
    next(error)
  }
}

module.exports = renderLargeCapitalProfile
