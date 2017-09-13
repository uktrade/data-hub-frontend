const { filter, find, get, unset } = require('lodash')

const metadataRepo = require('../../../../../lib/metadata')
const { transformIdToObject } = require('../../../../transformers')
const { FormController } = require('../../../controllers')
const { getAllAdvisers } = require('../../../../adviser/repos')
const { Order } = require('../../../models')

class ConfirmController extends FormController {
  configure (req, res, next) {
    res.breadcrumb(req.form.options.heading)
    super.configure(req, res, next)
  }

  async getValues (req, res, next) {
    const advisers = await getAllAdvisers(req.session.token)

    super.getValues(req, res, (err, values) => {
      const company = res.locals.company
      const contact = find(company.contacts, { id: values.contact })

      values.contact = `${contact.first_name} ${contact.last_name}`
      values.company = company
      values.primary_market = find(metadataRepo.countryOptions, { id: values.primary_market })
      values.subscribers = filter(values.subscribers).map((id) => {
        const adviser = find(advisers.results, { id })
        return get(adviser, 'name')
      })

      next(err, values)
    })
  }

  async successHandler (req, res, next) {
    const data = req.sessionModel.toJSON()
    const subscribers = data.subscribers.map(transformIdToObject)

    // clean un-needed properties
    unset(data, 'csrf-secret')
    unset(data, 'errors')

    try {
      const order = await Order.save(req.session.token, data)

      await Order.saveSubscribers(req.session.token, order.id, subscribers)

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
