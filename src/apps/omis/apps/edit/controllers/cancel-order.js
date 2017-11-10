const { get, filter, merge, pick } = require('lodash')

const { EditController } = require('../../../controllers')
const { transformObjectToOption } = require('../../../../transformers')
const { Order } = require('../../../models')
const metadataRepo = require('../../../../../lib/metadata')

class CancelOrderController extends EditController {
  async configure (req, res, next) {
    const orderStatus = get(res.locals, 'order.status')

    if (!['draft', 'quote_awaiting_acceptance'].includes(orderStatus)) {
      return res.redirect(`/omis/${res.locals.order.id}`)
    }

    const filteredReasons = filter(metadataRepo.orderCancellationReasons, (reason) => {
      return !reason.disabled_on
    })

    req.form.options = merge({}, req.form.options, {
      disableFormAction: false,
      returnText: 'Return without cancelling',
      buttonText: 'Cancel order',
      buttonModifiers: 'button--destructive',
      fields: {
        cancellation_reason: {
          options: filteredReasons.map(transformObjectToOption),
        },
      },
    })

    super.configure(req, res, next)
  }

  async successHandler (req, res, next) {
    const token = req.session.token
    const orderId = get(res.locals, 'order.id')
    const data = pick(req.sessionModel.toJSON(), Object.keys(req.form.options.fields))

    try {
      await Order.cancel(token, orderId, data)
      const nextUrl = req.form.options.next || `/omis/${orderId}`

      req.journeyModel.reset()
      req.journeyModel.destroy()
      req.sessionModel.reset()
      req.sessionModel.destroy()

      req.flash('success', 'Order cancelled')
      res.redirect(nextUrl)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CancelOrderController
