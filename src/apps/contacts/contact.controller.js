const express = require('express')

const contactRepository = require('./contact.repo')
const companyRepository = require('../../repos/company.repo')
const contactFormattingService = require('./contact-formatting.service')
const companyService = require('../../services/company.service')
const { contactDetailsLabels } = require('./labels')
const router = express.Router()

const reasonForArchiveOptions = [
  'Contact has left the company',
  'Contact does not want to be contacted',
  'Contact changed role/responsibility',
]

async function getCommon (req, res, next) {
  try {
    res.locals.id = req.params.contactId
    res.locals.contact = await contactRepository.getContact(req.session.token, req.params.contactId)
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

    res.render('contact/details')
  } catch (error) {
    next(error)
  }
}

router.get('/contact/:contactId/details', getCommon, getDetails)

module.exports = { router, getDetails, getCommon }
