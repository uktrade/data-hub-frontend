const { get, sortBy } = require('lodash')

const { CreateController } = require('../../../controllers')
const { transformContactToOption } = require('../../../../transformers')

class ContactController extends CreateController {
  middlewareLocals() {
    super.middlewareLocals()

    this.use(this.setHeading)
    this.use(this.setContacts)
  }

  setHeading(req, res, next) {
    req.form.options.heading = req.form.options.heading.replace(
      'the company',
      res.locals.company.name
    )

    next()
  }

  setContacts(req, res, next) {
    const company = get(res.locals, 'company')
    if (company) {
      const contacts = sortBy(
        company.contacts.map(transformContactToOption),
        'label'
      )
      req.form.options.fields.contact.options = contacts
    }

    if (req.form.options.fields.contact.options.length < 1) {
      req.form.options.disableFormAction = true
    }

    next()
  }
}

module.exports = ContactController
