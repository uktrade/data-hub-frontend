const router = require('express').Router()

const { ENTITIES } = require('../../../search/constants')

const {
  getCollection,
} = require('../../../../modules/search/middleware/collection')

const { setDefaultQuery } = require('../../../middleware')
const { setOrder } = require('../../middleware')
const { setInvoice, setPayments } = require('../view/middleware')
const { renderPaymentReceipt } = require('../view/controllers')
const { renderList } = require('./controllers')
const { setRequestBody } = require('../list/middleware')
const { setReconciliationJourney } = require('./middleware')
const { transformOrderToTableItem } = require('../../transformers')
const editApp = require('../edit')

const DEFAULT_QUERY_RECONCILIATION = {
  sortby: 'payment_due_date:asc',
  status: 'quote_accepted',
}

router.param('orderId', setOrder)

router.get(
  '/',
  setDefaultQuery(DEFAULT_QUERY_RECONCILIATION),
  setRequestBody,
  getCollection('order', ENTITIES, transformOrderToTableItem),
  renderList
)

router.get(
  '/:orderId/payment-receipt',
  setInvoice,
  setPayments,
  setReconciliationJourney,
  renderPaymentReceipt
)

router.use(editApp.mountpath, editApp.router)

module.exports = router
