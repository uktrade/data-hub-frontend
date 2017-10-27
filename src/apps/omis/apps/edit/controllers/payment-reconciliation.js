const { assign, get, pick } = require('lodash')
const numeral = require('numeral')
const chrono = require('chrono-node')
const dateFns = require('date-fns')

const logger = require('../../../../../../config/logger')
const { EditController } = require('../../../controllers')
const { Order } = require('../../../models')

class EditPaymentReconciliationController extends EditController {
  async configure (req, res, next) {
    const orderStatus = get(res.locals, 'order.status')

    req.form.options.disableFormAction = false
    req.form.options = assign({}, req.form.options, {
      buttonText: 'Reconcile payment',
      disableFormAction: false,
    })

    if (orderStatus !== 'quote_accepted') {
      req.form.options.hidePrimaryFormAction = true
      req.form.options.returnText = 'Return'
    }

    super.configure(req, res, next)
  }

  process (req, res, next) {
    const paymentDateStr = req.body.received_on
    const parsedDate = chrono.en_GB.parseDate(paymentDateStr)

    if (parsedDate) {
      req.form.values.received_on = dateFns.format(parsedDate, 'YYYY-MM-DD')
    } else {
      req.form.values.received_on = paymentDateStr
    }

    next()
  }

  validate (req, res, next) {
    const submittedAmount = numeral(req.form.values.amount).value()
    const totalCost = res.locals.order.total_cost

    if (submittedAmount < totalCost) {
      const error = { key: 'amount', type: 'isGreaterThanAmount' }
      const errors = {
        amount: new this.Error('amount', error, req, res),
      }

      return next(errors)
    }

    next()
  }

  async getValues (req, res, next) {
    let invoice

    try {
      invoice = await Order.getInvoice(req.session.token, res.locals.order.id)
    } catch (error) {
      logger.error(error)
    }

    super.getValues(req, res, (err, values) => {
      next(err, assign({}, values, {
        invoice,
      }))
    })
  }

  async successHandler (req, res, next) {
    const nextUrl = `/omis/${res.locals.order.id}/payment-receipt`
    const data = pick(req.sessionModel.toJSON(), Object.keys(req.form.options.fields))

    // convert pounds to pence
    data.amount = numeral(data.amount).value() * 100

    try {
      // TODO: Support adding of multiple payments
      // API accepts an array of payment objects
      // This solution sends the only payment captured in an array to solve this
      await Order.savePayments(req.session.token, res.locals.order.id, [data])

      req.journeyModel.reset()
      req.journeyModel.destroy()
      req.sessionModel.reset()
      req.sessionModel.destroy()

      req.flash('success', `Payment for ${res.locals.order.reference} reconciled`)
      res.redirect(nextUrl)
    } catch (err) {
      if (err.statusCode === 409) {
        req.flash('error', err.error.detail)
        return res.redirect(nextUrl)
      }

      next(err)
    }
  }
}

module.exports = EditPaymentReconciliationController
