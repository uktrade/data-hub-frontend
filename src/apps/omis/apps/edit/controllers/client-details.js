const { get, sortBy } = require('lodash')

const { EditController } = require('../../../controllers')
const { transformContactToOption } = require('../../../../transformers')

class EditClientDetailsController extends EditController {
  configure (req, res, next) {
    const company = get(res.locals, 'company')
    const contacts = []

    if (company) {
      const companyContacts = company.contacts.map(transformContactToOption)
      contacts.push(...sortBy(companyContacts, 'label'))
    }

    req.form.options.next = null
    req.form.options.fields.contact.options = contacts
    super.configure(req, res, next)
  }

  process (req, res, next) {
    req.form.values.company = get(res.locals, 'order.company.id')
    next()
  }
}

module.exports = EditClientDetailsController
