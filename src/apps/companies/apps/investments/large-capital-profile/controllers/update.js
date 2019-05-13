const { transformInvestorDetails, transformInvestorRequirements } = require('../transformers')
const { updateCompanyProfile } = require('../repos')
const { INVESTOR_DETAILS, INVESTOR_REQUIREMENTS } = require('../sections')

const updateProfile = async (req, res, next) => {
  const { profileId, editing } = req.body
  const { company } = res.locals
  const { token } = req.session

  let body
  if (editing === INVESTOR_DETAILS) {
    body = transformInvestorDetails(req.body)
  } else if (editing === INVESTOR_REQUIREMENTS) {
    body = transformInvestorRequirements(req.body)
  }

  try {
    await updateCompanyProfile(token, body, profileId)
    res.redirect(`/companies/${company.id}/investments/large-capital-profile`)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  updateProfile,
}
