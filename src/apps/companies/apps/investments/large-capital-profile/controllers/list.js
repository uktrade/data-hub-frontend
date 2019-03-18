const list = 'companies/apps/investments/large-capital-profile/views/list'
const { getCompanyProfiles } = require('../repos')

const renderLargeCapitalProfile = async (req, res, next) => {
  const token = req.session.token
  const { company, features } = res.locals

  const view = company.duns_number || features['companies-new-layout'] ? list : `${list}-deprecated`

  try {
    const companyProfiles = await getCompanyProfiles(token, company.id)
    res.render(view, {
      companyProfile: companyProfiles.results[0],
      company,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = renderLargeCapitalProfile
