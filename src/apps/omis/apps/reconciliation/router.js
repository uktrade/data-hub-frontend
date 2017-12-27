const router = require('express').Router()

const { setDefaultQuery } = require('../../../middleware')
const { setOrder } = require('../../middleware')
const { setInvoice, setPayments } = require('../view/middleware')
const { renderPaymentReceipt } = require('../view/controllers')
const { renderList } = require('./controllers')
const { setRequestBody } = require('../list/middleware')
const {
  setResults,
  setReconciliationJourney,
} = require('./middleware')
const editApp = require('../edit')

const DEFAULT_QUERY_RECONCILIATION = {
  sortby: 'payment_due_date:asc',
  status: 'quote_accepted',
}

router.param('orderId', setOrder)

router.get('/',
  setDefaultQuery(DEFAULT_QUERY_RECONCILIATION),
  setRequestBody,
  setResults,
  renderList
)

router.get('/:orderId/payment-receipt',
  setInvoice,
  setPayments,
  setReconciliationJourney,
  renderPaymentReceipt
)

router.use(editApp.mountpath, editApp.router)

module.exports = router
