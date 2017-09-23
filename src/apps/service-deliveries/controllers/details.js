const serviceDeliveryLabels = require('../labels')
const { getDisplayServiceDelivery } = require('../services/formatting')

const serviceDeliveryDisplayOrder = [
  'company',
  'dit_team',
  'service',
  'status',
  'subject',
  'notes',
  'date',
  'dit_adviser',
  'uk_region',
  'sector',
  'contact',
  'country_of_interest',
]

function renderDetailsPage (req, res) {
  res
    .breadcrumb(res.locals.serviceDelivery.subject)
    .render('service-deliveries/views/details', {
      serviceDeliveryLabels,
      serviceDeliveryDisplayOrder,
      serviceDeliveryDetails: getDisplayServiceDelivery(res.locals.serviceDelivery),
    })
}

module.exports = {
  renderDetailsPage,
}
