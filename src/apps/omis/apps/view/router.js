const router = require('express').Router()

const { setLocalNav, redirectToFirstNavItem } = require('../../../middleware')
const { renderWorkOrder, renderQuote } = require('./controllers')
const {
  setOrderBreadcrumb,
  setTranslation,
  getQuote,
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
router.use(setOrderBreadcrumb)

router.get('/', redirectToFirstNavItem)
router.get('/work-order', renderWorkOrder)
router
  .route('/quote')
  .get(getQuote, setQuoteForm, renderQuote)
  .post(generateQuote)

router.post('/quote/cancel', cancelQuote)

module.exports = router
