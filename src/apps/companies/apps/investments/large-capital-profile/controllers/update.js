const { transformInvestorDetails, transformInvestorRequirements, transformLocation } = require('../transformers')
const { updateCompanyProfile } = require('../repos')
const { INVESTOR_DETAILS, INVESTOR_REQUIREMENTS, LOCATION } = require('../sections')

const transformer = {
  [INVESTOR_DETAILS]: transformInvestorDetails,
  [INVESTOR_REQUIREMENTS]: transformInvestorRequirements,
  [LOCATION]: transformLocation,
}

const updateProfile = async (req, res, next) => {
  const { profileId, editing } = req.body
  const { company } = res.locals
  const { token } = req.session

  try {
    const body = transformer[editing](req.body)
    await updateCompanyProfile(token, body, profileId)
    res.redirect(`/companies/${company.id}/investments/large-capital-profile`)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  updateProfile,
}
