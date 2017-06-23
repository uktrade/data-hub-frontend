const router = require('express').Router()

const contactController = require('./controllers/details.controller')
const contactEditController = require('./controllers/edit.controller')
const contactArchiveController = require('./controllers/archive.controller')
const contactInteractionController = require('./controllers/interactions.controller')

router.get('/:contactId/details', contactController.getCommon, contactController.getDetails)

router
  .route('/add')
  .get(contactEditController.editDetails)
  .post(contactEditController.postDetails)

router
  .route('/:contactId/edit')
  .get(contactController.getCommon, contactEditController.editDetails)
  .post(contactEditController.postDetails)

router.post('/:id/archive', contactArchiveController.archiveContact)
router.get('/:id/unarchive', contactArchiveController.unarchiveContact)

router.get('/interactions/:contactId', contactController.getCommon, contactInteractionController.getInteractions)

module.exports = {
  path: '/contact',
  router,
}
