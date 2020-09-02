const { get } = require('lodash')

const { updateCompany } = require('../repos')

function transformErrorMessage(error) {
  return get(error, 'global_headquarters', ['There has been an error'])[0]
}

async function setGlobalHQ(req, res, next) {
  const companyId = req.params.companyId
  const globalHqId = req.params.globalHqId
  const body = { global_headquarters: globalHqId }
  const detailsUrl = `/companies/${companyId}/business-details`

  try {
    await updateCompany(req, companyId, body)

    req.flash('success', 'You’ve linked the Global Headquarters')
    return res.redirect(detailsUrl)
  } catch (error) {
    if (error.statusCode === 400) {
      req.flash('error', transformErrorMessage(error.error))
      return res.redirect(detailsUrl)
    }
    next(error)
  }
}

async function removeGlobalHQ(req, res, next) {
  const companyId = req.params.companyId
  const body = { global_headquarters: null }
  const detailsUrl = `/companies/${companyId}/business-details`

  try {
    await updateCompany(req, companyId, body)

    req.flash('success', 'You’ve removed the link to Global Headquarters')
    return res.redirect(detailsUrl)
  } catch (error) {
    if (error.statusCode === 400) {
      req.flash('error', transformErrorMessage(error.error))
      return res.redirect(detailsUrl)
    }
    next(error)
  }
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
  setGlobalHQ,
  removeGlobalHQ,
  addSubsidiary,
}
