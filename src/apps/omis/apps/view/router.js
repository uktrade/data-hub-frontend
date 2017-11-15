const router = require('express').Router()

const { setLocalNav, redirectToFirstNavItem } = require('../../../middleware')
const {
  setOrderBreadcrumb,
  setArchivedDocumentsBaseUrl,
} = require('../../middleware')
const {
  renderWorkOrder,
  renderQuote,
  renderPaymentReceipt,
} = require('./controllers')
const {
  setTranslation,
  setCompany,
  setContact,
  setAssignees,
  setQuoteSummary,
  setQuotePreview,
  setQuote,
  setQuoteForm,
  setInvoice,
  setPayments,
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
router.use(setArchivedDocumentsBaseUrl)

router.get('/', redirectToFirstNavItem)
router.get('/work-order', setContact, setAssignees, renderWorkOrder)
router.get('/payment-receipt', setInvoice, setPayments, renderPaymentReceipt)
router
  .route('/quote')
  .get(setQuotePreview, setQuote, setQuoteForm, renderQuote)
  .post(generateQuote)

router.post('/quote/cancel', cancelQuote)

module.exports = router
