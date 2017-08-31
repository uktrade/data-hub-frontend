const router = require('express').Router()

const { setLocalNav, redirectToFirstNavItem } = require('../../../middleware')
const { setOrderBreadcrumb } = require('./middleware')
const { renderWorkOrder } = require('./controllers')

const LOCAL_NAV = [
  { path: 'work-order', label: 'Work order' },
  // { path: 'payments', label: 'Payments' },
  // { path: 'deliverables', label: 'Deliverables' },
  // { path: 'history', label: 'History' },
]

router.use(setLocalNav(LOCAL_NAV))
router.use(setOrderBreadcrumb)

router.get('/', redirectToFirstNavItem)
router.get('/work-order', renderWorkOrder)

module.exports = router
