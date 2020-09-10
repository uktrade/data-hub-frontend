const { assign, find, get, isEmpty, unset } = require('lodash')

const metadataRepo = require('../../../../../lib/metadata')
const { CreateController } = require('../../../controllers')
const { Order } = require('../../../models')

class ConfirmController extends CreateController {
  getValues(req, res, next) {
    super.getValues(req, res, (err, values) => {
      const company = get(res.locals, 'company')
      const summaryValues = assign({}, values, {
        company,
        contact: find(company.contacts, { id: values.contact }),
        primary_market: find(metadataRepo.countryOptions, {
          id: values.primary_market,
        }),
        sector: find(metadataRepo.sectorOptions, { id: values.sector }),
      })

      next(err, summaryValues)
    })
  }

  async saveValues(req, res, next) {
    const data = req.sessionModel.toJSON()

    // clean un-needed properties
    unset(data, 'csrf-secret')
    unset(data, 'errors')

    try {
      const order = await Order.save(req, data)
      req.sessionModel.set('order-id', order.id)

      next()
    } catch (error) {
      next(error)
    }
  }

  successHandler(req, res) {
    const orderId = req.sessionModel.get('order-id')

    req.journeyModel.reset()
    req.journeyModel.destroy()
    req.sessionModel.reset()
    req.sessionModel.destroy()

    if (!isEmpty(req.form.options.successMessage)) {
      req.flash('success', req.form.options.successMessage)
    }
    res.redirect(`/omis/${orderId}`)
  }
}

module.exports = ConfirmController
