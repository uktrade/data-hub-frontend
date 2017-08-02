const { find, unset } = require('lodash')

const Controller = require('./base')
const metadataRepo = require('../../../../../lib/metadata')
const { getAdvisers } = require('../../../../adviser/repos')
const { Order } = require('../../../models')

class ConfirmController extends Controller {
  async getValues (req, res, next) {
    const advisers = await getAdvisers(req.session.token)

    super.getValues(req, res, (err, values) => {
      const company = res.locals.company
      const contact = find(company.contacts, { id: values.contact })

      values.contact = `${contact.first_name} ${contact.last_name}`
      values.company = company
      values.primary_market = find(metadataRepo.countryOptions, { id: values.primary_market })
      values.ita = find(advisers.results, { id: values.ita })

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
