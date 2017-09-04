const contactsRepository = require('../repos')
const companyRepository = require('../../companies/repos')
const contactFormattingService = require('../services/formatting')
const companyService = require('../../companies/services/data')
const { contactDetailsLabels } = require('../labels')

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
    const company = res.locals.company = await companyRepository.getDitCompany(token, contact.company.id)

    res.locals.id = req.params.contactId
    res.locals.companyUrl = companyService.buildCompanyUrl(company)
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
