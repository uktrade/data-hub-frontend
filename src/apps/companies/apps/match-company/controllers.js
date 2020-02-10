const { get, isEmpty, pick } = require('lodash')
const url = require('url')

const urls = require('../../../../lib/urls')
const { postToZenDesk } = require('../../../support/services')
const { getOptions } = require('../../../../lib/options')
const { searchDnbCompanies } = require('../../../../modules/search/services')

const ZENDESK_TICKET_TAG_MATCH_REQUEST = 'dnb_match_request'
const ZENDESK_TICKET_TYPE_TASK = 'task'

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

function createMatchRequestMessage(req, res) {
  const { company, user } = res.locals
  const { dnbCompany } = req.body
  const companyUrl = url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: urls.companies.detail(company.id),
  })

  const messageBody =
    `User ${user.name} requested a match of ${company.name}` +
    `(${companyUrl}) with the following D&B company:\n` +
    `Registered company name: ${dnbCompany.primary_name}\n` +
    `Trading name(s): ${
      !isEmpty(company.trading_names) ? company.trading_names.join(', ') : 'N/A'
    }\n` +
    `Located at: ${dnbCompany.address.join(', ')}\n` +
    `Registered address: ${dnbCompany.registered_address.join(', ')}\n` +
    `DUNS number: ${dnbCompany.duns_number}`

  // See Zendesk API docs: https://developer.zendesk.com/rest_api/docs/support/tickets
  return {
    type: ZENDESK_TICKET_TYPE_TASK,
    requester: {
      name: `Data Hub user - ${user.name}`,
      email: user.email,
    },
    subject: `D&B company match request for ${company.name}`,
    comment: {
      body: messageBody,
    },
    tags: [ZENDESK_TICKET_TAG_MATCH_REQUEST],
  }
}

async function submitMatchRequest(req, res) {
  try {
    const ticket = createMatchRequestMessage(req, res)
    const result = await postToZenDesk(ticket)

    req.flash(
      'success',
      'Verification requested. Some business details may be wrong.\n' +
        'Once verified, the warning message will disappear.'
    )
    res.json({ message: 'OK', ticket: get(result, 'data.ticket.id') })
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

module.exports = {
  renderMatchConfirmation,
  submitMatchRequest,
  renderFindCompanyForm,
  findDnbCompany,
  renderCannotFindMatch,
}
