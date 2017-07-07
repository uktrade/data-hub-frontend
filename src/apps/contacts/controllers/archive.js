const contactsRepository = require('../repos')

async function archiveContact (req, res, next) {
  try {
    const reason = (req.body.archived_reason !== 'Other') ? req.body.archived_reason : req.body.archived_reason_other

    if (reason.length > 0) {
      await contactsRepository.archiveContact(req.session.token, req.params.id, reason)
      req.flash('success', 'Updated contact record')
    } else {
      req.flash('error', 'Unable to archive contact, no reason given')
    }

    res.redirect(`/contacts/${req.params.id}`)
  } catch (error) {
    next(error)
  }
}

async function unarchiveContact (req, res, next) {
  try {
    await contactsRepository.unarchiveContact(req.session.token, req.params.id)
    req.flash('success', 'Updated contact record')
    res.redirect(`/contacts/${req.params.id}`)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  archiveContact,
  unarchiveContact,
}
