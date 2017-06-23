/* eslint new-cap: 0 */
const express = require('express')
const contactRepository = require('./contact.repo')
const router = express.Router()

async function archiveContact (req, res, next) {
  try {
    const reason = (req.body.archived_reason !== 'Other') ? req.body.archived_reason : req.body.archived_reason_other

    if (reason.length > 0) {
      await contactRepository.archiveContact(req.session.token, req.params.id, reason)
      req.flash('success-message', 'Updated contact record')
    } else {
      req.flash('error-message', 'Unable to archive contact, no reason given')
    }

    res.redirect(`/contact/${req.params.id}/details`)
  } catch (error) {
    next(error)
  }
}

async function unarchiveContact (req, res, next) {
  try {
    await contactRepository.unarchiveContact(req.session.token, req.params.id)
    req.flash('success-message', 'Updated contact record')
    res.redirect(`/contact/${req.params.id}/details`)
  } catch (error) {
    next(error)
  }
}

router.post('/contact/:id/archive', archiveContact)
router.get('/contact/:id/unarchive', unarchiveContact)

module.exports = { router, archiveContact, unarchiveContact }
