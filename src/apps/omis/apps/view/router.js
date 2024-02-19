const router = require('express').Router()

const { setLocalNav, redirectToFirstNavItem } = require('../../../middleware')

const LOCAL_NAV = [{ path: 'work-order', label: 'Work order' }]

router.use(setLocalNav(LOCAL_NAV))

router.get('/', redirectToFirstNavItem)

module.exports = router
