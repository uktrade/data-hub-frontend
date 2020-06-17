/* eslint-disable camelcase */

const { transformCountryToOptionWithIsoCode } = require('../../../transformers')
const { fetchOrganisationTypes } = require('./repos')
const { searchDnbCompanies } = require('../../../../modules/search/services')
const { getOptions } = require('../../../../lib/options')
const {
  transformToDnbStubCompany,
  transformToCreateDnbCompanyInvestigation,
} = require('./transformers')
const {
  saveDnbCompany,
  updateCompany,
  saveCompany,
  createDnbCompanyInvestigation,
} = require('../../repos')

async function renderAddCompanyForm(req, res, next) {
  try {
    const { token } = req.session
    const [countries, organisationTypes, regions, sectors] = await Promise.all([
      getOptions(token, 'country', {
        transformer: transformCountryToOptionWithIsoCode,
      }),
      fetchOrganisationTypes(token),
      getOptions(token, 'uk-region'),
      getOptions(token, 'sector'),
    ])

    res
      .breadcrumb('Add company')
      .render('companies/apps/add-company/views/client-container', {
        props: {
          countries,
          organisationTypes,
          regions,
          sectors,
        },
      })
  } catch (error) {
    next(error)
  }
}

async function postSearchDnbCompanies(req, res, next) {
  try {
    const results = await searchDnbCompanies({
      token: req.session.token,
      requestBody: req.body,
    })

    res.json(results)
  } catch (error) {
    next(error)
  }
}

async function postAddDnbCompany(req, res, next) {
  const { token } = req.session
  const { uk_region, sector, dnbCompany } = req.body

  try {
    const company = await saveDnbCompany(token, dnbCompany.duns_number)
    const result = await updateCompany(token, company.id, {
      uk_region,
      sector,
    })

    req.flash('success', 'Company added to Data Hub')
    res.json(result)
  } catch (error) {
    next(error)
  }
}

async function postAddDnbCompanyInvestigation(req, res, next) {
  const { token } = req.session
  const { body } = req

  try {
    // 1. Saves a stubbed record in Data Hub.
    // 2. Sends a single notification to request an investigation.
    const stubCompany = transformToDnbStubCompany(body)
    const company = await saveCompany(token, stubCompany)

    // 1. Creates a record which is proxied through to the DnB Service.
    // 2. Generates an excel spreadsheet for the support team to investigate.
    const create = transformToCreateDnbCompanyInvestigation(body, company.id)
    await createDnbCompanyInvestigation(token, create)

    req.flash('success', 'Company added to Data Hub')
    res.json(company)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAddCompanyForm,
  postSearchDnbCompanies,
  postAddDnbCompany,
  postAddDnbCompanyInvestigation,
}
