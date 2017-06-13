const router = require('express').Router()

const { interactionsLabels } = require('../labels')
const { getDataLabels } = require('../../../lib/controller-utils')
const {
  getInteractionDetails,
  getProjectDetails,
} = require('../shared.middleware')

function getInteractionDetailsHandler (req, res, next) {
  return res.render('investment/interactions/details', {
    details: getDataLabels(res.locals.interactionDetails, interactionsLabels.view),
  })
}

router.param('id', getProjectDetails)
router.param('interactionId', getInteractionDetails)

router
  .route('/:id/interaction/:interactionId/details')
  .get(getInteractionDetailsHandler)

module.exports = {
  router,
  getInteractionDetailsHandler,
}
