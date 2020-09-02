const { get, filter, merge } = require('lodash')

const { EditController } = require('../../../controllers')
const { transformObjectToOption } = require('../../../../transformers')
const { Order } = require('../../../models')
const metadataRepo = require('../../../../../lib/metadata')

class CancelOrderController extends EditController {
  async configure(req, res, next) {
    const orderStatus = get(res.locals, 'order.status')

    if (!['draft', 'quote_awaiting_acceptance'].includes(orderStatus)) {
      return res.redirect(`/omis/${res.locals.order.id}`)
    }

    const filteredReasons = filter(
      metadataRepo.orderCancellationReasons,
      (reason) => {
        return !reason.disabled_on
      }
    )

    req.form.options = merge({}, req.form.options, {
      disableFormAction: false,
      returnText: 'Return without cancelling',
      buttonText: 'Cancel order',
      buttonModifiers: 'govuk-button--warning',
      fields: {
        cancellation_reason: {
          options: filteredReasons.map(transformObjectToOption),
        },
      },
    })

    super.configure(req, res, next)
  }

  async saveValues(req, res, next) {
    const orderId = get(res.locals, 'order.id')
    const data = req.form.values

    try {
      await Order.cancel(req, orderId, data)
      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CancelOrderController
