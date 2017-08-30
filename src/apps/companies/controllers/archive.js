const { archiveCompany, unarchiveCompany, getDitCompany } = require('../repos')
const { buildCompanyUrl } = require('../services/data')

async function postArchiveCompany (req, res, next) {
  try {
    const company = await getDitCompany(req.session.token, req.params.id)
    const url = buildCompanyUrl(company)
    const reason = (req.body.archived_reason !== 'Other') ? req.body.archived_reason : req.body.archived_reason_other

    if (reason.length > 0) {
      await archiveCompany(req.session.token, company.id, reason)
      req.flash('success', 'Company record updated')
    } else {
      req.flash('error', 'Unable to archive company, no reason given')
    }

    res.redirect(url)
  } catch (error) {
    next(error)
  }
}

async function getUnarchiveCompany (req, res, next) {
  try {
    const company = await getDitCompany(req.session.token, req.params.id)
    const url = buildCompanyUrl(company)
    await unarchiveCompany(req.session.token, company.id)
    req.flash('success', 'Company record updated')
    res.redirect(url)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  postArchiveCompany,
  getUnarchiveCompany,
}
