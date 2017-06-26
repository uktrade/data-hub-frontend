const router = require('express').Router()

const contactController = require('./controllers/details')
const contactEditController = require('./controllers/edit')
const contactArchiveController = require('./controllers/archive')
const contactInteractionController = require('./controllers/interactions')

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

module.exports = router
