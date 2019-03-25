const transformProfile = require('../transformers/transform-profile')
const { getCompanyProfiles } = require('../repos')

const horizontalNav = 'companies/apps/investments/large-capital-profile/views/nav-horizontal'
const verticalNav = 'companies/apps/investments/large-capital-profile/views/nav-vertical'

const renderProfile = async (req, res, next) => {
  const token = req.session.token
  const { company, features } = res.locals
  const { edit } = req.query
  const data = { company, edit }

  const view = company.duns_number || features['companies-new-layout'] ? horizontalNav : verticalNav

  try {
    const profiles = await getCompanyProfiles(token, company.id)
    const profile = profiles.results && profiles.results[0]
    data.profile = profile ? transformProfile(profile) : data.profile
    res.render(view, data)
  } catch (error) {
    next(error)
  }
}

module.exports = renderProfile
