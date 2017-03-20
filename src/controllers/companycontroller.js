/* eslint new-cap: 0 */
const express = require('express')
const winston = require('winston')
const controllerUtils = require('../lib/controllerutils')
const companyRepository = require('../repositorys/companyrepository')
const companyService = require('../services/companyservice')
const metadataRepository = require('../repositorys/metadatarepository')
const companyFormattingService = require('../services/companyformattingservice')
const { companyDetailLabels, chDetailLabels, companyTableHeadings, companyTypeOptions } = require('../labels/companylabels')
const formatDate = require('../lib/date').formatDate
const router = express.Router()

function getCommon (req, res, next) {
  const id = req.params.sourceId
  const source = req.params.source
  companyService.getCompanyForSource(req.session.token, id, source)
  .then((company) => {
    const headingAddress = companyFormattingService.getHeadingAddress(company)
    const headingName = companyFormattingService.getHeadingName(company)

    res.locals.id = id
    res.locals.source = source
    res.locals.company = company
    res.locals.headingName = headingName
    res.locals.headingAddress = headingAddress
    next()
  })
  .catch((error) => {
    winston.error(error)
    next()
  })
}

function preParseFields (req, res, next) {
  const keys = Object.keys(req.body)
  for (const key of keys) {
    const value = req.body[key].toLowerCase()
    console.log(`${key}: ${value}`)
    if (value === 'yes' || value === 'true') {
      req.body[key] = true
    }
    if (value === 'no' || value === 'false') {
      req.body[key] = false
    }
  }
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

function editDetails (req, res) {
  const company = res.locals.company || {}
  const chDisplay = (company.companies_house) ? companyFormattingService.getDisplayCH(company) : null

  const businessType = company.business_type || req.query.business_type
  const ukBased = company.uk_based || (req.query.country === 'uk')

  let template
  if (businessType === 'ltd') {
    template = 'edit-ltd'
  } else if (businessType === 'ltdchild') {
    template = 'edit-ltdchild'
  } else if (!ukBased) {
    template = 'edit-nonuk'
  } else {
    template = 'edit-ukother'
  }

  res.render(`company/${template}`, {
    tab: 'details',
    chDisplay,
    companyDetailLabels,
    companyDetailsDisplayOrder: Object.keys(companyDetailLabels),
    chDetailLabels,
    chDetailsDisplayOrder: ['name', 'business_type', 'company_status', 'incorporation_date', 'sic_code'],
    companyTableHeadings,
    companyTableKeys: Object.keys(companyTableHeadings),
    companyTypeOptions,
    business_type: businessType,
    showHeadquarters: !controllerUtils.isBlank(company.headquarters),
    businessType,
    ukBased,
    REGION_OPTIONS: metadataRepository.REGION_OPTIONS,
    SECTOR_OPTIONS: metadataRepository.SECTOR_OPTIONS,
    EMPLOYEE_OPTIONS: metadataRepository.EMPLOYEE_OPTIONS,
    TURNOVER_OPTIONS: metadataRepository.TURNOVER_OPTIONS,
    countries: metadataRepository.COUNTRYS
  })
}

function postDetails (req, res, next) {
  preParseFields(req, res)
  // Flatten selected fields
  const company = Object.assign({}, req.body)
  companyRepository.saveCompany(req.session.token, company)
    .then((data) => {
      req.flash('success-message', 'Updated company record')
      res.redirect(`/company/company_company/${data.id}/details`)
    })
    .catch((error) => {
      winston.debug(error)
      if (error.errors) {
        winston.debug(error)
        res.locals.errors = controllerUtils.transformErrors(error.errors)
        res.locals.company = req.body
        return editDetails(req, res)
      }

      return next(error)
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

module.exports = { router }
