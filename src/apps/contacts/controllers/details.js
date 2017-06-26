const contactsRepository = require('../repos')
const companyRepository = require('../../companies/repos')
const contactFormattingService = require('../services/formatting')
const companyService = require('../../companies/services/data')
const { contactDetailsLabels } = require('../labels')

const reasonForArchiveOptions = [
  'Contact has left the company',
  'Contact does not want to be contacted',
  'Contact changed role/responsibility',
]

async function getCommon (req, res, next) {
  try {
    res.locals.id = req.params.contactId
    res.locals.contact = await contactsRepository.getContact(req.session.token, req.params.contactId)
    res.locals.company = await companyRepository.getDitCompany(req.session.token, res.locals.contact.company.id)
    res.locals.companyUrl = companyService.buildCompanyUrl(res.locals.company)
    res.locals.reasonForArchiveOptions = reasonForArchiveOptions
    res.locals.title = [`${res.locals.contact.first_name} ${res.locals.contact.last_name}`, 'Contacts']

    next()
  } catch (error) {
    next(error)
  }
}

function getDetails (req, res, next) {
  try {
    res.locals.tab = 'details'
    res.locals.contactDetails = contactFormattingService.getDisplayContact(res.locals.contact, res.locals.company)
    res.locals.contactDetailsLabels = contactDetailsLabels
    res.locals.contactDetailsDisplayOrder = Object.keys(res.locals.contactDetails)

    res.render('contacts/views/details')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDetails,
  getCommon,
}
