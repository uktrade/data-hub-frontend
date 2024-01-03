const router = require('express').Router()

const urls = require('../../lib/urls')
const { renderDetailsPage } = require('./controllers/details')
const { getInteractionDetails } = require('./middleware/details')

const detailsFormRouter = require('./apps/details-form/router')

router.param('interactionId', getInteractionDetails)

router.use(detailsFormRouter)

router.get(urls.interactions.detail.route, renderDetailsPage)

module.exports = router
