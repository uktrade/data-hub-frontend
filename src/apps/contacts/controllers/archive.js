const contactsRepository = require('../repos')

async function unarchiveContact(req, res, next) {
  try {
    await contactsRepository.unarchiveContact(req, req.params.id)
    res.redirect(`/contacts/${req.params.id}`)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  unarchiveContact,
}
