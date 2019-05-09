const { createCompanyProfile } = require('./../../../companies/apps/investments/large-capital-profile/repos.js')
const createProfile = async (req, res, next) => {
  if (!req.body.investor_company) {
    res.locals.form = Object.assign({}, res.locals.form, {
      errors: {
        'messages': {
          'investor_company': ['Enter a company name'],
        },
      },
    })
    return next()
  }

  try {
    const profile = await createCompanyProfile(req.session.token, { investor_company: req.body.investor_company })
    res.redirect(`/companies/${profile.investor_company.id}/investments/large-capital-profile`)
  } catch (err) {
    res.locals.form = Object.assign({}, res.locals.form, {
      errors: {
        'summary': err.error.investor_company,
      },
    })
    next()
  }
}

module.exports = { createProfile }
