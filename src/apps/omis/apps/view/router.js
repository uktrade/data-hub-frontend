const router = require('express').Router()

const { setLocalNav, redirectToFirstNavItem } = require('../../../middleware')
const { setOrderBreadcrumb } = require('../../middleware')
const { renderWorkOrder, renderQuote } = require('./controllers')
const {
  setTranslation,
  setCompany,
  setQuoteSummary,
  setQuotePreview,
  setQuote,
  setQuoteForm,
  generateQuote,
  cancelQuote,
} = require('./middleware')

const LOCAL_NAV = [
  { path: 'work-order', label: 'Work order' },
  // { path: 'payments', label: 'Payments' },
  // { path: 'deliverables', label: 'Deliverables' },
  // { path: 'history', label: 'History' },
]

router.use(setLocalNav(LOCAL_NAV))
router.use(setTranslation)
router.use(setCompany)
router.use(setOrderBreadcrumb)
router.use(setQuoteSummary)

router.get('/', redirectToFirstNavItem)
router.get('/work-order', renderWorkOrder)
router
  .route('/quote')
  .get(setQuotePreview, setQuote, setQuoteForm, renderQuote)
  .post(generateQuote)

router.post('/quote/cancel', cancelQuote)

module.exports = router
