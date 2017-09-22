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
const { renderForm } = require('./controllers/edit')
const { getRequestBody, getCompanyCollection } = require('./middleware/collection')
const { populateForm, handleFormPost } = require('./middleware/form')
const { getCompany, getCompaniesHouseRecord } = require('./middleware/params')
const { setDefaultQuery } = require('../middleware')

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'modified_on:desc',
}

router.param('id', getCompany)
router.param('companyNumber', getCompaniesHouseRecord)

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
router.get('/view/ukother/:id', ukotherController.getDetails)
router.get('/view/foreign/:id', foreignController.getDetails)

router
  .route([
    '/add/foreign',
    '/edit/foreign/:id',
    '/add/ukother',
    '/edit/ukother/:id',
    '/add/ltd',
    '/add/ltd/:companyNumber',
    '/edit/ltd/:id',
  ])
  .get(populateForm, renderForm)
  .post(populateForm, handleFormPost, renderForm)

router.get('/:id/investments', investmentsController.getAction)
router.get('/:id/audit', auditController.getAudit)

router.param('companyId', getCompanyDetails)
router.get('/:companyId/interactions', getInteractionCollection, renderInteractions)

module.exports = router
