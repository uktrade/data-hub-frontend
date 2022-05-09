const contactsRepository = require('../repos')

async function archiveContact(req, res, next) {
  try {
    const reason =
      req.body.archived_reason !== 'Other'
        ? req.body.archived_reason
        : req.body.archived_reason_other

    await contactsRepository.archiveContact(req, req.params.id, reason)
    res.redirect(`/contacts/${req.params.id}`)
  } catch (error) {
    next(error)
  }
}

async function unarchiveContact(req, res, next) {
  try {
    await contactsRepository.unarchiveContact(req, req.params.id)
    res.redirect(`/contacts/${req.params.id}`)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  archiveContact,
  unarchiveContact,
}
