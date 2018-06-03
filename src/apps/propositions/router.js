const router = require('express').Router()

const { APP_PERMISSIONS } = require('./constants')

const { renderDetailsPage } = require('./controllers/details')

const { handleRoutePermissions } = require('../middleware')

const { getPropositionDetails } = require('./middleware/details')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.param('propositionId', getPropositionDetails)

router.get('/:propositionId', renderDetailsPage)

module.exports = router
