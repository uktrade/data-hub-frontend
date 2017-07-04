const router = require('express').Router()

const {
  chDisplayData,
  companyData,
} = require('./middleware')

const {
  addController,
  archiveController,
  contactsController,
  detailsController,
  expController,
  foreignController,
  interactionsController,
  investmentsController,
  ltdController,
  ukotherController,
} = require('./controllers')

router
  .route('/company/add-step-1/')
  .get(addController.getAddStepOne)
  .post(addController.postAddStepOne)

router.get('/company/add-step-2/', addController.getAddStepTwo)

router.post('/company/archive/:id', archiveController.postArchiveCompany)
router.get('/company/unarchive/:id', archiveController.getUnarchiveCompany)

router.get('/company-contacts/:id', contactsController.getContacts)

router.get('/company-exports/view/:id', expController.view)

router
  .route('/company-exports/edit/:id')
  .get(expController.edit)
  .post(expController.post)

router
  .route('/company/edit/ltd/:id')
  .get(foreignController.editCommon, ltdController.editDetails)
  .post(foreignController.postDetails)

router
  .route('/company/add/ltd')
  .get(foreignController.editCommon, ltdController.addDetails)
  .post(foreignController.postDetails)

router
  .route('/company/edit/ukother/:id')
  .get(foreignController.editCommon, ukotherController.editDetails)
  .post(foreignController.postDetails)

router
  .route('/company/add/ukother')
  .get(foreignController.editCommon, ukotherController.addDetails)
  .post(foreignController.postDetails)

router
  .route('/company/edit/foreign/:id')
  .get(foreignController.editCommon, foreignController.editDetails)
  .post(foreignController.postDetails)

router
  .route('/company/add/foreign')
  .get(foreignController.editCommon, foreignController.addDetails)
  .post(foreignController.postDetails)

router.use('/companies/:id', companyData)
router.get('/companies/:id/*', chDisplayData)

router.get('/companies/:id/details', detailsController.getDetails)

router.get('/company-interactions/:id', interactionsController.getInteractions)
router.get('/company/:id/investments', investmentsController.getAction)

module.exports = router
