const router = require('express').Router()

const { addController } = require('./controllers')
const { renderCompanyList } = require('./controllers/list')
const { renderForm } = require('./controllers/edit')
const { renderDetails } = require('./controllers/view')
const { renderInvestments } = require('./controllers/investments')
const { renderAuditLog } = require('./controllers/audit')
const { renderInteractions } = require('./controllers/interactions')
const { renderCompaniesHouseCompany } = require('./controllers/companies-house')
const { archiveCompany, unarchiveCompany } = require('./controllers/archive')
const { renderContacts } = require('./controllers/contacts')
const {
  renderExports,
  populateExportForm,
  renderExportEdit,
  handleEditFormPost,
} = require('./controllers/exports')

const { setDefaultQuery } = require('../middleware')
const { getInteractionCollection } = require('./middleware/interactions')
const { getRequestBody, getCompanyCollection } = require('./middleware/collection')
const { populateForm, handleFormPost } = require('./middleware/form')
const { getCompany, getCompaniesHouseRecord } = require('./middleware/params')

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

router
  .route('/:companyId/exports/edit')
  .get(populateExportForm, renderExportEdit)
  .post(populateExportForm, handleEditFormPost, renderExportEdit)

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

router.post('/:companyId/archive', archiveCompany)
router.get('/:companyId/unarchive', unarchiveCompany)

router.get('/:companyId/contacts', renderContacts)
router.get('/:companyId/interactions', getInteractionCollection, renderInteractions)
router.get('/:companyId/exports', renderExports)
router.get('/:companyId/investments', renderInvestments)
router.get('/:companyId/audit', renderAuditLog)

router.get('/view/ch/:companyNumber', renderCompaniesHouseCompany)
router.get('/:companyId', renderDetails)

module.exports = router
