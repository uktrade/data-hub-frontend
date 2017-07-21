const router = require('express').Router()

const {
  addController,
  archiveController,
  chController,
  contactsController,
  expController,
  foreignController,
  interactionsController,
  investmentsController,
  ltdController,
  ukotherController,
} = require('./controllers')

router
  .route('/add-step-1/')
  .get(addController.getAddStepOne)
  .post(addController.postAddStepOne)

router.get('/add-step-2/', addController.getAddStepTwo)

router.post('/archive/:id', archiveController.postArchiveCompany)
router.get('/unarchive/:id', archiveController.getUnarchiveCompany)

router.get('/view/ch/:id', chController.getDetails)

router.get('/:id/contacts/', contactsController.getContacts)

router.get('/:id/exports', expController.view)

router
  .route('/:id/exports/edit')
  .get(expController.edit)
  .post(expController.post)

router.get('/view/ltd/:id', ltdController.getDetails)

router
  .route('/edit/ltd/:id')
  .get(foreignController.editCommon, ltdController.editDetails)
  .post(foreignController.postDetails)

router
  .route('/add/ltd/:company_number')
  .get(foreignController.editCommon, ltdController.addDetails)
  .post(foreignController.postDetails)

router
  .route('/add/ltd')
  .get(foreignController.editCommon, ltdController.addDetails)
  .post(foreignController.postDetails)

router.get('/view/ukother/:id', ukotherController.getDetails)

router
  .route('/edit/ukother/:id')
  .get(foreignController.editCommon, ukotherController.editDetails)
  .post(foreignController.postDetails)

router
  .route('/add/ukother')
  .get(foreignController.editCommon, ukotherController.addDetails)
  .post(foreignController.postDetails)

router.get('/view/foreign/:id', foreignController.getDetails)

router
  .route('/edit/foreign/:id')
  .get(foreignController.editCommon, foreignController.editDetails)
  .post(foreignController.postDetails)

router
  .route('/add/foreign')
  .get(foreignController.editCommon, foreignController.addDetails)
  .post(foreignController.postDetails)

router.get('/:id/interactions', interactionsController.getInteractions)
router.get('/:id/investments', investmentsController.getAction)

module.exports = router
