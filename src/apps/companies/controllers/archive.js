/* eslint-disable camelcase */
const { archiveCompany: archive, unarchiveCompany: unarchive } = require('../repos')
const logger = require('../../../../config/logger')

async function archiveCompany (req, res) {
  const { company } = res.locals
  const { archived_reason, archived_reason_other } = req.body
  const reason = archived_reason_other || archived_reason
  const returnUrl = req.query.redirect || `/companies/${company.id}`

  if (!reason) {
    req.flash('error', 'A reason must be supplied to archive a company')
    return res.redirect(returnUrl)
  }

  try {
    await archive(req.session.token, company.id, reason)

    req.flash('success', 'Company archived')
    res.redirect(returnUrl)
  } catch (error) {
    logger.error(error)

    req.flash('error', 'Company could not be archived')
    res.redirect(returnUrl)
  }
}

async function unarchiveCompany (req, res) {
  const { company } = res.locals
  const returnUrl = req.query.redirect || `/companies/${company.id}`

  try {
    await unarchive(req.session.token, company.id)

    req.flash('success', 'Company unarchived')
    res.redirect(returnUrl)
  } catch (error) {
    logger.error(error)

    req.flash('error', 'Company could not be archived')
    res.redirect(returnUrl)
  }
}

module.exports = {
  archiveCompany,
  unarchiveCompany,
}
