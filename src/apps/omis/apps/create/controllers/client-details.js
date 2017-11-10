const { get, sortBy } = require('lodash')

const { FormController } = require('../../../controllers')
const { transformContactToOption } = require('../../../../transformers')

class ClientDetailsController extends FormController {
  configure (req, res, next) {
    const company = get(res.locals, 'company')
    let contacts = []

    if (company) {
      const companyName = company.trading_name || company.name
      contacts = company.contacts.map(transformContactToOption)
      contacts = sortBy(contacts, 'label')
      req.form.options.heading = req.form.options.heading.replace('the client company', companyName)
    }

    req.form.options.fields.contact.options = contacts
    super.configure(req, res, next)
  }

  process (req, res, next) {
    req.form.values.company = res.locals.company.id
    next()
  }
}

module.exports = ClientDetailsController
