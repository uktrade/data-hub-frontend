const router = require('express').Router()

const {
  redirectEstimatedLandDate,
  redirectNoRecentInteraction,
  redirectOutstandingPropositions,
  redirectEstimatedLandDateSettings,
  redirectNoRecentInteractionSettings,
} = require('./controller')

router.get('/estimated-land-date', redirectEstimatedLandDate)
router.get('/no-recent-interaction', redirectNoRecentInteraction)
router.get('/outstanding-propositions', redirectOutstandingPropositions)
router.get('/settings/estimated-land-date', redirectEstimatedLandDateSettings)
router.get(
  '/settings/no-recent-interaction',
  redirectNoRecentInteractionSettings
)

module.exports = router
