const router = require('express').Router()

const {
  getCommon,
  getServiceDeliveryEdit,
  postServiceDeliveryEdit,
  getServiceDeliveryDetails,
} = require('./controllers')

router.get('/:serviceDeliveryId/*', getCommon)

router.get('/:serviceDeliveryId', getServiceDeliveryDetails)

router
  .route('/:serviceDeliveryId/edit')
  .get(getServiceDeliveryEdit)
  .post(postServiceDeliveryEdit)

module.exports = router
