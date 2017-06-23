const router = require('express').Router()

const contactController = require('./contact.controller')
const contactEditController = require('./contact-edit.controller')
const contactArchiveController = require('./contact-archive.controller')
const contactInteractionController = require('./contact-interaction.controller')

router.use(
  contactController.router,
  contactEditController.router,
  contactArchiveController.router,
  contactInteractionController.router,
)

module.exports = {
  router,
}
