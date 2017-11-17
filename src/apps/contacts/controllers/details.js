const contactsRepository = require('../repos')
const companyRepository = require('../../companies/repos')
const { transformContactToView } = require('../transformers')

const reasonForArchiveOptions = [
  'Left the company',
  'Does not want to be contacted',
  'Changed role/responsibility',
]
const reasonForArchiveOptionsPrefix = 'This contact has:'

async function getCommon (req, res, next) {
  try {
    const token = req.session.token
    const contact = res.locals.contact = await contactsRepository.getContact(token, req.params.contactId)

    res.locals.company = await companyRepository.getDitCompany(token, contact.company.id)
    res.locals.id = req.params.contactId
    res.locals.reasonForArchiveOptions = reasonForArchiveOptions
    res.locals.reasonForArchiveOptionsPrefix = reasonForArchiveOptionsPrefix

    res.breadcrumb(`${contact.first_name} ${contact.last_name}`, `/contacts/${contact.id}`)

    next()
  } catch (error) {
    next(error)
  }
}

function getDetails (req, res, next) {
  try {
    res.render('contacts/views/details', {
      contactDetails: transformContactToView(res.locals.contact, res.locals.company),
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDetails,
  getCommon,
}
