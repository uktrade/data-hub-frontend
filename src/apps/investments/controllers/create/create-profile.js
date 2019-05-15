const { set } = require('lodash')

const { createCompanyProfile } = require('./../../../companies/apps/investments/large-capital-profile/repos.js')

const createProfile = async (req, res, next) => {
  if (!req.body.investor_company) {
    set(res.locals, 'errors.messages.investor_company', ['Enter a company name'])
    return next()
  }

  try {
    const profile = await createCompanyProfile(req.session.token, { investor_company: req.body.investor_company })
    res.redirect(`/companies/${profile.investor_company.id}/investments/large-capital-profile`)
  } catch (err) {
    if (err.statusCode === 400) {
      // profile already exists for investor_company
      set(res.locals, 'errors.summary', err.error.investor_company)
      next()
    } else {
      next(err)
    }
  }
}

module.exports = { createProfile }
