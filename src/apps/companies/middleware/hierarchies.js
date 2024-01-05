const { get } = require('lodash')

const { updateCompany } = require('../repos')

function transformErrorMessage(error) {
  return get(error, 'global_headquarters', ['There has been an error'])[0]
}

async function addSubsidiary(req, res, next) {
  const { companyId, subsidiaryCompanyId } = req.params
  const body = { global_headquarters: companyId }

  try {
    await updateCompany(req, subsidiaryCompanyId, body)
    req.flash('success', 'You’ve linked the subsidiary')
  } catch (error) {
    if (error.statusCode !== 400) {
      return next(error)
    }

    req.flash('error', transformErrorMessage(error.error))
  }

  return res.redirect(`/companies/${companyId}/subsidiaries`)
}

module.exports = {
  addSubsidiary,
}
