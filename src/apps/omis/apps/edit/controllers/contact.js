const { get, sortBy } = require('lodash')

const { EditController } = require('../../../controllers')
const { transformContactToOption } = require('../../../../transformers')

class EditContactController extends EditController {
  configure(req, res, next) {
    const company = get(res.locals, 'company')
    const contacts = []

    if (company) {
      const companyContacts = company.contacts.map(transformContactToOption)
      contacts.push(...sortBy(companyContacts, 'label'))
    }

    if (req.form.options.disableFormAction) {
      req.form.options.disableFormAction = !get(
        res.locals,
        'order.canEditContactDetails'
      )
    }

    req.form.options.fields.contact.options = contacts
    super.configure(req, res, next)
  }

  process(req, res, next) {
    req.form.values.company = get(res.locals, 'order.company.id')
    next()
  }
}

module.exports = EditContactController
