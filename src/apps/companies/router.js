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
  auditController,
} = require('./controllers')

const { renderCompanyList } = require('./controllers/list')
const { getRequestBody, getCompanyCollection } = require('./middleware')
const { setDefaultQuery } = require('../middleware')

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'modified_on:asc',
}
router.get('/', setDefaultQuery(DEFAULT_COLLECTION_QUERY), getRequestBody, getCompanyCollection, renderCompanyList)

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
router.get('/:id/audit', auditController.getAudit)

module.exports = router
