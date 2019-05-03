const { transformInvestorDetails } = require('../transformers')
const { updateCompanyProfile } = require('../repos')
const { INVESTOR_DETAILS } = require('../sections')

const updateProfile = async (req, res, next) => {
  const { profileId, editing } = req.body
  const { company } = res.locals
  const { token } = req.session

  let body
  if (editing === INVESTOR_DETAILS) {
    body = transformInvestorDetails(req.body)
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
