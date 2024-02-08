const router = require('express').Router()

const urls = require('../../lib/urls')

const { QUERY_FIELDS, QUERY_DATE_FIELDS } = require('./constants')

const { getRequestBody } = require('../../middleware/collection')
const {
  exportCollection,
} = require('../../modules/search/middleware/collection')

const { shared } = require('./middleware')

const { create, editHistory } = require('./controllers')

const { renderAddEvidence } = require('./apps/evidence/controllers/create')
const { postUpload } = require('../documents/middleware/upload')

const { setCompanyDetails } = require('./middleware/interactions')
const { setPropositionsReturnUrl } = require('./middleware/propositions')
const {
  setEvidenceReturnUrl,
  setEvidenceDocumentsOptions,
} = require('./middleware/evidence')

const interactionsRouter = require('../interactions/router.sub-app')
const propositionsRouter = require('../propositions/router.sub-app')

router.param('investmentId', shared.getInvestmentDetails)
router.param('companyId', shared.getCompanyDetails)

router.get(
  '/export',
  getRequestBody(QUERY_FIELDS, QUERY_DATE_FIELDS),
  exportCollection('investment_project')
)

router.get(
  urls.investments.editHistory.data.route,
  editHistory.fetchProjectsHistoryHandler
)

// Add investment from Companies
router.get('/create/:companyId?', create.start.renderCreatePage)

// Add investment from Investments
router.get('/create', create.start.renderCreatePage)

router
  .route('/:investmentId/evidence/add-new')
  .get(setEvidenceReturnUrl, renderAddEvidence)
  .post(setEvidenceReturnUrl, setEvidenceDocumentsOptions, postUpload)

router.use(
  urls.investments.projects.interactions.index.route,
  setCompanyDetails,
  interactionsRouter
)

router.use('/:investmentId', setPropositionsReturnUrl, propositionsRouter)

module.exports = router
