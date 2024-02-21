const router = require('express').Router()

const { APP_PERMISSIONS } = require('./constants')

const { handleRoutePermissions } = require('../middleware')
const { setOrder } = require('./middleware')

const viewApp = require('./apps/view')
const listApp = require('./apps/list')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.param('orderId', setOrder)
router.use(listApp.mountpath, listApp.router)
router.use(viewApp.mountpath, viewApp.router)
module.exports = router
