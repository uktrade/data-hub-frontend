const { find, get, unset } = require('lodash')

const metadataRepo = require('../../../../../lib/metadata')
const { FormController } = require('../../../controllers')
const { Order } = require('../../../models')

class ConfirmController extends FormController {
  async getValues (req, res, next) {
    super.getValues(req, res, (err, values) => {
      const company = res.locals.company
      const contact = find(company.contacts, { id: values.contact })

      values.company = company
      values.contact = `${get(contact, 'first_name')} ${get(contact, 'last_name')}`
      values.primary_market = find(metadataRepo.countryOptions, { id: values.primary_market })

      next(err, values)
    })
  }

  async successHandler (req, res, next) {
    const data = req.sessionModel.toJSON()

    // clean un-needed properties
    unset(data, 'csrf-secret')
    unset(data, 'errors')

    try {
      const order = await Order.save(req.session.token, data)

      req.journeyModel.reset()
      req.journeyModel.destroy()
      req.sessionModel.reset()
      req.sessionModel.destroy()

      res.redirect(`/omis/${order.id}`)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ConfirmController
