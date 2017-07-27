const router = require('express').Router()

const { setHomeBreadcrumb } = require('../middleware')
const createApp = require('./apps/create')

router.use(createApp.mountpath, setHomeBreadcrumb(createApp.displayName), createApp.router)

module.exports = router
