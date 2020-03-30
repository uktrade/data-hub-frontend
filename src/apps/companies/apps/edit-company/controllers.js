const url = require('url')
const { isEmpty } = require('lodash')

const config = require('../../../../config')
const { updateCompany, createDnbChangeRequest } = require('../../repos')
const { getHeadquarterOptions } = require('./repos')
const { getOptions } = require('../../../../lib/options')
const urls = require('../../../../lib/urls')
const {
  transformCompanyToForm,
  transformFormToApi,
  transformFormToZendesk,
  transformFormToDnbChangeRequest,
} = require('./transformers')
const { postToZenDesk } = require('../../../support/services')
const { isItaTierDAccount } = require('../../../../lib/is-tier-type-company')

const ZENDESK_TICKET_TAG_CHANGE_REQUEST = 'company_details_change_request'
const ZENDESK_TICKET_TYPE_TASK = 'task'

async function renderEditCompanyForm(req, res, next) {
  try {
    const { company } = res.locals
    const { token } = req.session

    const [
      turnoverRanges,
      employeeRanges,
      regions,
      sectors,
      headquarterTypes,
    ] = await Promise.all([
      getOptions(token, 'turnover', { sorted: false }),
      getOptions(token, 'employee-range', { sorted: false }),
      getOptions(token, 'uk-region', { sorted: false }),
      getOptions(token, 'sector', { sorted: false }),
      getHeadquarterOptions(token),
    ])

    res
      .breadcrumb(company.name, urls.companies.detail(company.id))
      .breadcrumb(
        'Business details',
        urls.companies.businessDetails(company.id)
      )
      .breadcrumb('Edit business details')
      .render('companies/apps/edit-company/views/client-container', {
        props: {
          company,
          oneListEmail: config.oneList.email,
          isOnOneList:
            company.one_list_group_tier && !isItaTierDAccount(company),
          formInitialValues: transformCompanyToForm(company),
          turnoverRanges,
          employeeRanges,
          regions,
          sectors,
          headquarterTypes,
        },
      })
  } catch (error) {
    next(error)
  }
}

function createUpdateRequest(formValues, req, res) {
  const { company } = res.locals
  const transformedCompanyValues = transformCompanyToForm(company)

  if (isEmpty(formValues)) {
    return
  }

  return postToZenDesk(
    createUpdateRequestMessage(formValues, transformedCompanyValues, req, res)
  )
}

function createUpdateRequestMessage(
  formValues,
  transformedCompanyValues,
  req,
  res
) {
  const { company, user } = res.locals
  const companyUrl = url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: urls.companies.detail(company.id),
  })

  const changesMatrix = Object.keys(formValues).map(
    (fieldName) =>
      `Current ${fieldName}: ${transformedCompanyValues[fieldName] ||
        'Not set'}\nRequested ${fieldName}: ${formValues[fieldName]}`
  )

  const messageBody =
    `User ${user.name} requested company details change of ${company.name} (${companyUrl})\n\n` +
    `Company DUNS number: ${company.duns_number}\n\n` +
    changesMatrix.join('\n\n')

  return {
    type: ZENDESK_TICKET_TYPE_TASK,
    requester: {
      name: `Data Hub user - ${user.name}`,
      email: user.email,
    },
    subject: `Business details change request for ${company.name}`,
    comment: {
      body: messageBody,
    },
    tags: [ZENDESK_TICKET_TAG_CHANGE_REQUEST],
  }
}

async function postEditCompany(req, res, next) {
  try {
    const { company } = res.locals
    const { token } = req.session

    const apiRequestFields = transformFormToApi(company, req.body)
    const zendeskRequestFields = transformFormToZendesk(company, req.body)

    const dnbChanges = company.duns_number
      ? transformFormToDnbChangeRequest(company, req.body)
      : null

    if (company.duns_number && !isEmpty(zendeskRequestFields)) {
      const [, , ...zendeskResponses] = await Promise.all([
        updateCompany(token, company.id, apiRequestFields),
        createDnbChangeRequest(token, company.duns_number, dnbChanges),
        createUpdateRequest(zendeskRequestFields, req, res),
      ])

      req.flashWithBody(
        'success',
        'Update sent for third party review.',
        'Thanks for keeping Data Hub running smoothly.',
        'message-company-change-request'
      )
      res.json({
        changeRequests: zendeskResponses.map((r) => r.data.ticket.description),
      })
    } else {
      const result = await updateCompany(
        req.session.token,
        company.id,
        apiRequestFields
      )
      req.flash('success', 'Company record updated')
      res.json(result)
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderEditCompanyForm,
  postEditCompany,
}
