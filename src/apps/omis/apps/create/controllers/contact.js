const { get, sortBy } = require('lodash')

const { CreateController } = require('../../../controllers')
const { transformContactToOption } = require('../../../../transformers')

class ContactController extends CreateController {
  middlewareLocals () {
    super.middlewareLocals()

    this.use(this.setHeading)
    this.use(this.setContacts)
  }

  setHeading (req, res, next) {
    const company = get(res.locals, 'company')

    if (company) {
      const companyName = company.trading_name || company.name
      req.form.options.heading = req.form.options.heading.replace('the company', companyName)
    }

    next()
  }

  setContacts (req, res, next) {
    const company = get(res.locals, 'company')

    if (company) {
      const contacts = sortBy(company.contacts.map(transformContactToOption), 'label')
      req.form.options.fields.contact.options = contacts
    }

    next()
  }
}

module.exports = ContactController
