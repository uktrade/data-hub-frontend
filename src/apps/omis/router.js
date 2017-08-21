const router = require('express').Router()

const { setHomeBreadcrumb } = require('../middleware')
const { getOrder } = require('./middleware/params')
const createApp = require('./apps/create')
const editApp = require('./apps/edit')
const listApp = require('./apps/list')
const viewApp = require('./apps/view')

router.param('orderId', getOrder)

router.use(createApp.mountpath, setHomeBreadcrumb(createApp.displayName), createApp.router)
router.use(editApp.mountpath, setHomeBreadcrumb(editApp.displayName), editApp.router)
router.use(viewApp.mountpath, setHomeBreadcrumb(viewApp.displayName), viewApp.router)
router.use(listApp.mountpath, listApp.router)

module.exports = router
