const router = require('express').Router()

const { setLocalNav, redirectToFirstNavItem } = require('../../../middleware')
const { setOrderBreadcrumb } = require('../../middleware')
const { renderQuote } = require('./controllers')
const {
  setCompany,
  setContact,
  setQuoteSummary,
  setQuotePreview,
  setQuote,
  setQuoteForm,
  generateQuote,
  cancelQuote,
} = require('./middleware')

const LOCAL_NAV = [{ path: 'work-order', label: 'Work order' }]

router.use(setLocalNav(LOCAL_NAV))
router.use(setCompany)
router.use(setOrderBreadcrumb)
router.use(setQuoteSummary)

router.get('/', redirectToFirstNavItem)
router
  .route('/quote')
  .get(setContact, setQuotePreview, setQuote, setQuoteForm, renderQuote)
  .post(setContact, generateQuote)

router.post('/quote/cancel', cancelQuote)

module.exports = router
