/* eslint-disable camelcase */
const { archiveCompany: archive, unarchiveCompany: unarchive } = require('../repos')
const logger = require('../../../../config/logger')

function getDetailsUrl (features, company) {
  return features['companies-new-layout'] ? `/companies/${company.id}/business-details` : `/companies/${company.id}`
}

async function archiveCompany (req, res) {
  const { company, features } = res.locals
  const { archived_reason, archived_reason_other } = req.body
  const reason = archived_reason_other || archived_reason
  const detailsUrl = getDetailsUrl(features, company)

  if (!reason) {
    req.flash('error', 'A reason must be supplied to archive a company')
    return res.redirect(detailsUrl)
  }

  try {
    await archive(req.session.token, company.id, reason)

    req.flash('success', 'Company archived')
    res.redirect(detailsUrl)
  } catch (error) {
    logger.error(error)

    req.flash('error', 'Company could not be archived')
    res.redirect(detailsUrl)
  }
}

async function unarchiveCompany (req, res) {
  const { company, features } = res.locals
  const detailsUrl = getDetailsUrl(features, company)

  try {
    await unarchive(req.session.token, company.id)

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
