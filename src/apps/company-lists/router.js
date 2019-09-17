const router = require('express').Router()

const { APP_PERMISSIONS } = require('./constants')
const { handleRoutePermissions } = require('../middleware')

router.use(handleRoutePermissions(APP_PERMISSIONS))

module.exports = router
