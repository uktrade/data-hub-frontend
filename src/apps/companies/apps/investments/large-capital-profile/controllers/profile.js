const transformProfile = require('../transformers/transform-profile')
const { getCompanyProfiles } = require('../repos')

const renderProfile = async (req, res, next) => {
  const token = req.session.token
  const { company } = res.locals
  const { edit } = req.query
  const data = { company, edit }

  try {
    const profiles = await getCompanyProfiles(token, company.id)
    const profile = profiles.results && profiles.results[0]
    data.profile = profile ? transformProfile(profile) : data.profile
    res.render('companies/apps/investments/large-capital-profile/views/profile', data)
  } catch (error) {
    next(error)
  }
}

module.exports = renderProfile
