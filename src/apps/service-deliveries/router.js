const router = require('express').Router()

const {
  getCommon,
  getServiceDeliveryEdit,
  postServiceDeliveryEdit,
  getServiceDeliveryDetails,
} = require('./controllers')

router
  .route('/create')
  .get(getServiceDeliveryEdit)
  .post(postServiceDeliveryEdit)

router.get('/:serviceDeliveryId/*', getCommon)

router.get('/:serviceDeliveryId', getCommon, getServiceDeliveryDetails)

router
  .route('/:serviceDeliveryId/edit')
  .get(getServiceDeliveryEdit)
  .post(postServiceDeliveryEdit)

module.exports = router
