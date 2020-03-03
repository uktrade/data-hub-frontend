const { get, isEmpty, pick } = require('lodash')

const { searchDnbCompanies } = require('../../../../modules/search/services')
const { linkDataHubCompanyToDnBCompany } = require('../../repos')
const { getOptions } = require('../../../../lib/options')
const { postToZenDesk } = require('../../../support/services')
const urls = require('../../../../lib/urls')
const url = require('url')

const ZENDESK_TICKET_TAG_MERGE_REQUEST = 'dnb_merge_request'
const ZENDESK_TICKET_TYPE_TASK = 'task'

function getCompanyAbsoluteUrl(req, companyId) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: urls.companies.detail(companyId),
  })
}

function getCountries(token) {
  return getOptions(token, 'country', {
    transformer: ({ id, name, iso_alpha2_code }) => ({
      id,
      name,
      iso_alpha2_code,
    }),
  })
}

function getCountryName(country, countries) {
  return get(
    typeof country === 'string'
      ? countries.find((c) => c.iso_alpha2_code === country)
      : country,
    'name'
  )
}

function getCountryCode(company, countries) {
  const companyID = get(company, 'address.country.id')
  return get(
    countries.find((c) => c.id === companyID),
    'iso_alpha2_code'
  )
}

function parseAddress(dnbCompany, countries, prefix = '') {
  return Object.values(
    pick(
      {
        ...dnbCompany,
        [`${prefix}country`]: getCountryName(
          get(dnbCompany, `${prefix}country`),
          countries
        ),
      },
      [
        `${prefix}line_1`,
        `${prefix}line_2`,
        `${prefix}town`,
        `${prefix}postcode`,
        `${prefix}country`,
      ]
    )
  ).filter((v) => !isEmpty(v))
}

async function renderMatchConfirmation(req, res, next) {
  try {
    const { company } = res.locals
    const { token } = req.session
    const { dunsNumber } = req.params
    const countries = await getCountries(token)

    const results = await searchDnbCompanies({
      token,
      requestBody: {
        duns_number: dunsNumber,
      },
    })

    const dnbCompany = get(results, 'results[0].dnb_company')
    const dataHubCompanyId = get(results, 'results[0].datahub_company.id')

    res
      .breadcrumb(company.name, urls.companies.detail(company.id))
      .breadcrumb(dataHubCompanyId ? 'Request merge' : 'Send request')
      .render('companies/apps/match-company/views/match-confirmation', {
        props: {
          dnbCompanyIsMatched: !!dataHubCompanyId,
          company: {
            ...pick(company, ['id', 'name', 'trading_names']),
            ...pick(company, ['name']),
            address: parseAddress(company.address, countries),
          },
          dnbCompany: {
            ...pick(dnbCompany, ['primary_name', 'duns_number']),
            datahub_company_id: dataHubCompanyId,
            address: parseAddress(dnbCompany, countries, 'address_'),
            registered_address: parseAddress(
              dnbCompany,
              countries,
              'registered_address_'
            ),
          },
        },
      })
  } catch (error) {
    next(error)
  }
}

async function linkCompanies(req, res) {
  try {
    const { token } = req.session
    const { company } = res.locals
    const { dnbCompany } = req.body

    const result = await linkDataHubCompanyToDnBCompany(
      token,
      company.id,
      dnbCompany.duns_number
    )

    req.flashWithBody(
      'success',
      'Business details verified.',
      'Thanks for helping to improve the quality of records on Data Hub!',
      'message-company-matched'
    )
    res.json(result)
  } catch (error) {
    const statusCode = get(error, 'response.status', 500)
    const message = get(error, 'response.data.description')
    res.status(statusCode).json({ message })
  }
}

async function renderFindCompanyForm(req, res, next) {
  try {
    const { company } = res.locals
    const { token } = req.session
    const countries = await getCountries(token)

    res
      .breadcrumb(company.name, urls.companies.detail(company.id))
      .breadcrumb('Search for verified business details')
      .render('companies/apps/match-company/views/find-company', {
        props: {
          company: {
            ...pick(company, ['id', 'name']),
            address: parseAddress(company.address, countries),
            postcode: get(company, 'address.postcode'),
            countryCode: getCountryCode(company, countries),
          },
        },
      })
  } catch (error) {
    next(error)
  }
}

async function findDnbCompany(req, res, next) {
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

async function renderCannotFindMatch(req, res, next) {
  try {
    const { company } = res.locals
    res
      .breadcrumb(company.name, urls.companies.detail(company.id))
      .breadcrumb('Cannot find details')
      .render('companies/apps/match-company/views/cannot-find-match', {
        props: {
          companyId: company.id,
        },
      })
  } catch (error) {
    next(error)
  }
}

async function submitMergeRequest(req, res, next) {
  try {
    const ticket = createMergeRequestMessage(req, res)
    const result = await postToZenDesk(ticket)

    req.flash(
      'success',
      'Company merge requested. Thanks for keeping Data Hub running smoothly.'
    )
    res.json({ message: 'OK', ticket: get(result, 'data.ticket.id') })
  } catch (error) {
    next(error)
  }
}

function createMergeRequestMessage(req, res) {
  const { company, user } = res.locals
  const { dnbCompany } = req.body
  const dataHubCompanyUrl = getCompanyAbsoluteUrl(req, company.id)
  const duplicatedCompanyUrl = getCompanyAbsoluteUrl(
    req,
    dnbCompany.datahub_company_id
  )

  const messageBody =
    `User ${user.name} requested a merge of ${company.name} (${dataHubCompanyUrl})` +
    ` with ${dnbCompany.primary_name} (${duplicatedCompanyUrl})`

  // See Zendesk API docs: https://developer.zendesk.com/rest_api/docs/support/tickets
  return {
    type: ZENDESK_TICKET_TYPE_TASK,
    requester: {
      name: `Data Hub user - ${user.name}`,
      email: user.email,
    },
    subject: `Company merge request of ${company.name} with ${dnbCompany.primary_name}`,
    comment: {
      body: messageBody,
    },
    tags: [ZENDESK_TICKET_TAG_MERGE_REQUEST],
  }
}

module.exports = {
  renderMatchConfirmation,
  renderFindCompanyForm,
  findDnbCompany,
  renderCannotFindMatch,
  submitMergeRequest,
  linkCompanies,
}
