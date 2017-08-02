const router = require('express').Router()

const { setHomeBreadcrumb } = require('../middleware')
const { getOrder } = require('./middleware/params')
const viewApp = require('./apps/view')
const createApp = require('./apps/create')

router.param('orderId', getOrder)

router.use(viewApp.mountpath, setHomeBreadcrumb(viewApp.displayName), viewApp.router)
router.use(createApp.mountpath, setHomeBreadcrumb(createApp.displayName), createApp.router)

module.exports = router
