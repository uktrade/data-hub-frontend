/* eslint new-cap: 0 */
const express = require('express')
const winston = require('winston')
const companyRepository = require('../repositorys/companyrepository')
const companyService = require('../services/companyservice')
const metadataRepository = require('../repositorys/metadatarepository')
const companyFormattingService = require('../services/companyformattingservice')
const { companyDetailLabels, chDetailLabels, companyTableHeadings, hqLabels } = require('../labels/companylabels')
const formatDate = require('../lib/date').formatDate
const router = express.Router()
const { isBlank } = require('../lib/controllerutils')

function getCommon (req, res, next) {
  const id = req.params.sourceId
  const source = req.params.source
  companyService.getCompanyForSource(req.session.token, id, source)
  .then((company) => {
    res.locals.headingName = companyFormattingService.getHeadingName(company)
    res.locals.headingAddress = companyFormattingService.getHeadingAddress(company)
    res.locals.id = id
    res.locals.source = source
    res.locals.company = company
    next()
  })
  .catch((error) => {
    winston.error(error)
    next()
  })
}

function getDetails (req, res, next) {
  try {
    const company = res.locals.company
    const companyDisplay = companyFormattingService.getDisplayCompany(company)
    const chDisplay = companyFormattingService.getDisplayCH(company)
    const parents = companyFormattingService.parseRelatedData(company.parents)
    const children = companyFormattingService.parseRelatedData(company.children)

    res.render('company/details', {
      tab: 'details',
      companyDisplay,
      chDisplay,
      companyDetailLabels,
      companyDetailsDisplayOrder: Object.keys(companyDetailLabels),
      chDetailLabels,
      chDetailsDisplayOrder: ['name', 'company_number', 'registered_address', 'business_type', 'company_status', 'sic_code'],
      companyTableHeadings,
      companyTableKeys: Object.keys(companyTableHeadings),
      children,
      parents
    })
  } catch (error) {
    next(error)
  }
}

// Figure out the business type using either the existing company business type
// the companies house type or type sent in the request for a new company
function calculateBusinessType (company, req) {
  if (company && company.business_type && company.business_type !== null && typeof company.business_type === 'object') {
    return company.business_type
  } else if (company && company.companies_house_data) {
    for (const businessType of metadataRepository.TYPES_OF_BUSINESS) {
      if (businessType.name.toLowerCase() === company.companies_house_data.company_category.toLowerCase()) {
        return businessType
      }
    }
  } else if (req.query && req.query.business_type) {
    for (const businessType of metadataRepository.TYPES_OF_BUSINESS) {
      if (businessType.name.toLowerCase() === req.query.business_type.toLowerCase()) {
        return businessType
      }
    }
  }
}

function editDetails (req, res) {
  const company = res.locals.company || {}

  if (company.companies_house_data) {
    res.locals.chDisplay = companyFormattingService.getDisplayCH(company)
    res.locals.chDetailLabels = chDetailLabels
    res.locals.chDetailDisplayOrder = ['name', 'company_number', 'registered_address', 'business_type']
  }

  const businessType = res.locals.business_type = calculateBusinessType(company, req)
  const ukBased = res.locals.uk_based = (company.companies_house_data || company.uk_based || (req.query && req.query.country && req.query.country === 'uk'))

  let template
  if (businessType.name.toLowerCase() === 'private limited company' || businessType.name.toLowerCase() === 'public limited company') {
    template = 'edit-ltd'
  } else if (!ukBased) {
    template = 'edit-nonuk'
  } else {
    template = 'edit-ukother'
  }

  if (!isBlank(company.trading_address_country)) {
    res.locals.showTradingAddress = true
  } else {
    res.locals.showTradingAddress = false
  }

  res.render(`company/${template}`, {
    companyDetailLabels,
    regionOptions: metadataRepository.REGION_OPTIONS,
    sectorOptions: metadataRepository.SECTOR_OPTIONS,
    employeeOptions: metadataRepository.EMPLOYEE_OPTIONS,
    turnoverOptions: metadataRepository.TURNOVER_OPTIONS,
    countryOptions: metadataRepository.COUNTRYS,
    headquarterOptions: metadataRepository.headquarterOptions,
    hqLabels
  })
}

function postDetails (req, res, next) {
  companyRepository.saveCompany(req.session.token, req.body)
    .then((data) => {
      req.flash('success-message', 'Updated company record')
      res.redirect(`/company/company_company/${data.id}/details`)
    })
    .catch((error) => {
      winston.debug(error)
      if (error.errors) {
        // if something went wrong, gather data as if a get request
        // then override it with the daa entered
        winston.debug(error)
        // Leeloo has inconsistant structure to return errors.
        if (error.errors.errors) {
          res.locals.errors = error.errors.errors
        } else {
          res.locals.errors = error.errors
        }

        getCommon(req, res, function () {
          res.locals.company = Object.assign({}, res.locals.company, req.body)
          editDetails(req, res, next)
        })
      } else {
        return next(error)
      }
    })
}

function getContacts (req, res) {
  // build the data for the contact table.
  const contactTableData = res.locals.company.contacts
    .filter(contact => contact.archived === false)
    .map((contact) => {
      return {
        name: `<a href="/contact/{{ contact.id }}">${contact.first_name} ${contact.last_name}</a>`,
        job_title: contact.job_title,
        telephone_number: contact.telephone_number,
        email: `<a href="mailto:${contact.email}">${contact.email}</a>`
      }
    })

  const archivedContactTableData = res.locals.company.contacts
    .filter(contact => contact.archived === true)
    .map((contact) => {
      return {
        name: `<a href="/contact/{{ contact.id }}">${contact.first_name} ${contact.last_name}</a>`,
        job_title: contact.job_title,
        telephone_number: contact.telephone_number,
        email: `<a href="mailto:${contact.email}">${contact.email}</a>`
      }
    })

  const tableLabels = {
    name: 'Name',
    job_title: 'Role',
    telephone_number: 'Phone',
    email: 'Email'
  }

  const tableFieldOrder = Object.keys(tableLabels)

  res.render('company/contacts', {
    tab: 'contacts',
    contactTableData,
    archivedContactTableData,
    tableLabels,
    tableFieldOrder
  })
}

function getInteractions (req, res) {
  // build the data for the contact table.
  const interactionTableData = res.locals.company.interactions.map((interaction) => {
    return {
      date: formatDate(interaction.date),
      interaction_type: interaction.interaction_type.name,
      advisor: `${interaction.dit_advisor.first_name} ${interaction.dit_advisor.last_name}`,
      subject: `<a href="/${(interaction.interaction_type.name === 'Service delivery') ? 'servicedelivery' : 'interaction'}/${interaction.id}/details">${interaction.subject}</a>`
    }
  })

  const tableLabels = {
    date: 'Date',
    interaction_type: 'Type',
    advisor: 'Advisor',
    subject: 'Subject'
  }

  const tableFieldOrder = Object.keys(tableLabels)

  res.render('company/interactions', {
    tab: 'interactions',
    interactionTableData,
    tableLabels,
    tableFieldOrder
  })
}

function getExport (req, res) {
  res.render('company/export', {tab: 'export'})
}

router.use('/company/:source/:sourceId/*', getCommon)
router.get(['/company/:source/:sourceId/edit', '/company/add'], editDetails)
router.post(['/company/:source/:sourceId/edit', '/company/add'], postDetails)
router.get('/company/:source/:sourceId/details', getDetails)
router.get('/company/:source/:sourceId/contacts', getContacts)
router.get('/company/:source/:sourceId/interactions', getInteractions)
router.get('/company/:source/:sourceId/export', getExport)

module.exports = { router, editDetails, getCommon, postDetails }
