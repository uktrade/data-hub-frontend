const { sortBy } = require('lodash')

const { FormController } = require('../../../controllers')
const { transformContactToOption } = require('../../../../transformers')

class CompanyDetailsController extends FormController {
  configure (req, res, next) {
    const company = res.locals.company
    let contacts = []

    if (company) {
      contacts = company.contacts.map(transformContactToOption)
      contacts = sortBy(contacts, 'label')
    }

    req.form.options.fields.contact.options = contacts
    super.configure(req, res, next)
  }

  getValues (req, res, next) {
    const company = res.locals.company

    super.getValues(req, res, (err, values) => {
      values.company = company.id

      next(err, values)
    })
  }
}

module.exports = CompanyDetailsController
