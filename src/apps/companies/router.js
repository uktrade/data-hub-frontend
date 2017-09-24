const router = require('express').Router()

const { getInteractionCollection } = require('./middleware/interactions')
const { renderInteractions } = require('./controllers/interactions')

const {
  addController,
  archiveController,
  contactsController,
  expController,
  investmentsController,
  auditController,
} = require('./controllers')

const { renderCompanyList } = require('./controllers/list')
const { renderForm } = require('./controllers/edit')
const { renderDetails } = require('./controllers/view')
const { renderCompaniesHouseCompany } = require('./controllers/companies-house')
const { getRequestBody, getCompanyCollection } = require('./middleware/collection')
const { populateForm, handleFormPost } = require('./middleware/form')
const { getCompany, getCompaniesHouseRecord } = require('./middleware/params')
const { setDefaultQuery } = require('../middleware')

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'modified_on:desc',
}

router.param('companyId', getCompany)
router.param('companyNumber', getCompaniesHouseRecord)

router.get('/', setDefaultQuery(DEFAULT_COLLECTION_QUERY), getRequestBody, getCompanyCollection, renderCompanyList)

router
  .route('/add-step-1/')
  .get(addController.getAddStepOne)
  .post(addController.postAddStepOne)

router.get('/add-step-2/', addController.getAddStepTwo)

router.post('/archive/:id', archiveController.postArchiveCompany)
router.get('/unarchive/:id', archiveController.getUnarchiveCompany)

router.get('/:id/contacts/', contactsController.getContacts)

router.get('/:id/exports', expController.view)

router
  .route('/:id/exports/edit')
  .get(expController.edit)
  .post(expController.post)

router.get('/view/ch/:companyNumber', renderCompaniesHouseCompany)
router.get([
  '/view/ltd/:companyId',
  '/view/ukother/:companyId',
  '/view/foreign/:companyId',
], renderDetails)

router
  .route([
    '/add/foreign',
    '/add/ukother',
    '/add/ltd',
    '/add/ltd/:companyNumber',
    '/:companyId/edit',
  ])
  .get(populateForm, renderForm)
  .post(populateForm, handleFormPost, renderForm)

router.get('/:id/investments', investmentsController.getAction)
router.get('/:id/audit', auditController.getAudit)

router.get('/:companyId/interactions', getInteractionCollection, renderInteractions)

module.exports = router
