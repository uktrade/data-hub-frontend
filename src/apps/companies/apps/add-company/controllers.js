/* eslint-disable camelcase */

const { transformCountryToOptionWithIsoCode } = require('../../../transformers')
const { fetchOrganisationTypes } = require('./repos')
const { searchDnbCompanies } = require('../../../../modules/search/services')
const { saveDnbCompany, saveDnbCompanyInvestigation } = require('../../repos')
const { getOptions } = require('../../../../lib/options')
const { transformToDnbCompanyInvestigationApi } = require('./transformers')

async function renderAddCompanyForm (req, res, next) {
  try {
    const [countries, organisationTypes, regions, sectors] = await Promise.all([
      getOptions(req.session.token, 'country', {
        transformer: transformCountryToOptionWithIsoCode,
      }),
      fetchOrganisationTypes(req.session.token),
      getOptions(req.session.token, 'uk-region'),
      getOptions(req.session.token, 'sector'),
    ])

    res
      .breadcrumb('Add company')
      .render('companies/apps/add-company/views/client-container', {
        props: {
          countries,
          organisationTypes,
          regions,
          sectors,
          host: req.headers.host,
          csrfToken: res.locals.csrfToken,
        },
      })
  } catch (error) {
    next(error)
  }
}

async function postSearchDnbCompanies (req, res, next) {
  try {
    const results = await searchDnbCompanies({
      token: req.session.token,
      requestBody: req.body,
      csrfToken: res.locals.csrfToken,
    })

    res.json(results)
  } catch (error) {
    next(error)
  }
}

async function postAddDnbCompany (req, res, next) {
  try {
    const result = await saveDnbCompany(req.session.token, req.body.dnbCompany.duns_number)
    req.flash('success', 'Company added to Data Hub')
    res.json(result)
  } catch (error) {
    next(error)
  }
}

async function postAddDnbCompanyInvestigation (req, res, next) {
  try {
    const transformed = transformToDnbCompanyInvestigationApi(req.body)
    const result = await saveDnbCompanyInvestigation(req.session.token, transformed)
    req.flash('success', 'Company added to Data Hub')
    res.json(result)
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
