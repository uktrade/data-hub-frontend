/* eslint-disable camelcase */
const {
  archiveCompany: archive,
  unarchiveCompany: unarchive,
} = require('../repos')
const logger = require('../../../config/logger')

async function archiveCompany(req, res) {
  const { company } = res.locals
  const { archived_reason, archived_reason_other } = req.body
  const reason = archived_reason_other || archived_reason
  const detailsUrl = `/companies/${company.id}/business-details`

  if (!reason) {
    req.flash('error', 'A reason must be supplied to archive a company')
    return res.redirect(detailsUrl)
  }

  try {
    await archive(req, company.id, reason)

    req.flash('success', 'Company archived')
    res.redirect(detailsUrl)
  } catch (error) {
    logger.error(error)

    req.flash('error', 'Company could not be archived')
    res.redirect(detailsUrl)
  }
}

async function unarchiveCompany(req, res) {
  const { company } = res.locals
  const detailsUrl = `/companies/${company.id}/business-details`

  try {
    await unarchive(req, company.id)

    req.flash('success', 'Company unarchived')
    res.redirect(detailsUrl)
  } catch (error) {
    logger.error(error)

    req.flash('error', 'Company could not be archived')
    res.redirect(detailsUrl)
  }
}

module.exports = {
  archiveCompany,
  unarchiveCompany,
}
