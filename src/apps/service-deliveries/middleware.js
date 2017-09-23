const { saveServiceDelivery } = require('./repos')
const { convertServiceDeliveryFormToApiFormat } = require('./services/data')
const { getHydratedServiceDelivery } = require('./services/data')

async function fetchDetails (req, res, next, serviceDeliveryId) {
  try {
    res.locals.serviceDelivery = await getHydratedServiceDelivery(req.session.token, serviceDeliveryId)
    next()
  } catch (error) {
    next(error)
  }
}

async function postDetails (req, res, next) {
  try {
    const deliveryToSave = convertServiceDeliveryFormToApiFormat(req.body)
    const result = await saveServiceDelivery(req.session.token, deliveryToSave)
    res.redirect(`/service-deliveries/${result.data.id}`)
  } catch (error) {
    if (error.error) {
      res.locals.formErrors = error.error.errors || error.error
      return next()
    }
    next(error)
  }
}

module.exports = {
  fetchDetails,
  postDetails,
}
