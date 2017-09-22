const router = require('express').Router()

const { getCompanyDetails } = require('./middleware/details')
const { getInteractionCollection } = require('./middleware/interactions')
const { renderInteractions } = require('./controllers/interactions')

const {
  addController,
  archiveController,
  chController,
  contactsController,
  expController,
  foreignController,
  investmentsController,
  ltdController,
  ukotherController,
  auditController,
} = require('./controllers')

const { renderCompanyList } = require('./controllers/list')
const { getRequestBody, getCompanyCollection } = require('./middleware/collection')
const { populateForm, handleFormPost } = require('./middleware/form')
const { setDefaultQuery } = require('../middleware')

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'modified_on:desc',
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
  .get(populateForm, ltdController.editDetails)
  .post(populateForm, handleFormPost, ltdController.editDetails)

router
  .route('/add/ltd/:company_number')
  .get(populateForm, ltdController.addDetails)
  .post(populateForm, handleFormPost, ltdController.addDetails)

router
  .route('/add/ltd')
  .get(populateForm, ltdController.addDetails)
  .post(populateForm, handleFormPost, ltdController.addDetails)

router.get('/view/ukother/:id', ukotherController.getDetails)

router
  .route('/edit/ukother/:id')
  .get(populateForm, ukotherController.editDetails)
  .post(populateForm, handleFormPost, ukotherController.editDetails)

router
  .route('/add/ukother')
  .get(populateForm, ukotherController.addDetails)
  .post(populateForm, handleFormPost, ukotherController.addDetails)

router.get('/view/foreign/:id', foreignController.getDetails)

router
  .route('/edit/foreign/:id')
  .get(populateForm, foreignController.editDetails)
  .post(populateForm, handleFormPost, foreignController.editDetails)

router
  .route('/add/foreign')
  .get(populateForm, foreignController.addDetails)
  .post(populateForm, handleFormPost, foreignController.addDetails)

router.get('/:id/investments', investmentsController.getAction)
router.get('/:id/audit', auditController.getAudit)

router.param('companyId', getCompanyDetails)
router.get('/:companyId/interactions', getInteractionCollection, renderInteractions)

module.exports = router
