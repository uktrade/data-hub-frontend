const router = require('express').Router()

const interactionLabels = require('../../../labels/interaction-labels')
const {
  getInteractionDetails,
  getProjectDetails,
} = require('../shared.middleware')

function getInteractionDetailsHandler (req, res, next) {
  return res.render('investment/interactions/details', {
    interactionLabels,
  })
}

router.param('id', getProjectDetails)
router.param('interactionId', getInteractionDetails)
router.route('/:id/interaction/:interactionId/details')
  .get(getInteractionDetailsHandler)

module.exports = {
  router,
  getInteractionDetailsHandler,
}
