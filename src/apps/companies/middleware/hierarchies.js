const { get } = require('lodash')

const { updateCompany } = require('../repos')

function transformErrorMessage (error) {
  return get(error, 'global_headquarters', ['There has been an error'])[0]
}

async function setGlobalHQ (req, res, next) {
  const token = req.session.token
  const companyId = req.params.companyId
  const globalHqId = req.params.globalHqId
  const body = { global_headquarters: globalHqId }

  try {
    const response = await updateCompany(token, companyId, body)

    req.flash('success', 'You’ve linked the Global Headquarters')
    return res.redirect(`/companies/${response.id}/details`)
  } catch (error) {
    if (error.statusCode === 400) {
      req.flash('error', transformErrorMessage(error.error))
      return res.redirect(`/companies/${companyId}/details`)
    }
    next(error)
  }
}

async function removeGlobalHQ (req, res, next) {
  const token = req.session.token
  const companyId = req.params.companyId
  const body = { global_headquarters: null }

  try {
    const response = await updateCompany(token, companyId, body)

    req.flash('success', 'You’ve removed the link to Global Headquarters')
    return res.redirect(`/companies/${response.id}/details`)
  } catch (error) {
    if (error.statusCode === 400) {
      req.flash('error', transformErrorMessage(error.error))
      return res.redirect(`/companies/${companyId}/details`)
    }
    next(error)
  }
}

async function addSubsidiary (req, res, next) {
  const token = req.session.token
  const { companyId, subsidiaryCompanyId } = req.params
  const body = { global_headquarters: companyId }

  try {
    await updateCompany(token, subsidiaryCompanyId, body)
    req.flash('success', 'You’ve linked the Subsidiary')
  } catch (error) {
    if (error.statusCode !== 400) {
      return next(error)
    }

    req.flash('error', transformErrorMessage(error.error))
  }

  return res.redirect(`/companies/${companyId}/subsidiaries`)
}

async function removeSubsidiary (req, res, next) {
  const token = req.session.token
  const parentCompanyId = req.params.parentCompanyId
  const body = { global_headquarters: null }

  try {
    const response = await updateCompany(token, parentCompanyId, body)

    req.flash('success', 'You’ve removed the link to the Subsidiary')
    return res.redirect(`/companies/${response.id}/details`)
  } catch (error) {
    if (error.statusCode === 400) {
      req.flash('error', transformErrorMessage(error.error))
      return res.redirect(`/companies/${parentCompanyId}/details`)
    }
    next(error)
  }
}

module.exports = {
  setGlobalHQ,
  removeGlobalHQ,
  addSubsidiary,
  removeSubsidiary,
}
