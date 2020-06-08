const router = require('express').Router()

const urls = require('../../../../lib/urls')
const {
  fetchActiveEvents,
  renderInteractionDetailsForm,
} = require('./controllers')
const { getInteractionDetails } = require('../../middleware/details')

router.param('interactionId', getInteractionDetails)

router.route(urls.interactions.create.route).get(renderInteractionDetailsForm)

router
  .route(urls.interactions.createType.route)
  .get(renderInteractionDetailsForm)

router.route(urls.interactions.edit.route).get(renderInteractionDetailsForm)

router.get(urls.interactions.activeEventsData.route, fetchActiveEvents)

module.exports = router
