const url = require('url')

const config = require('../../../../config')
const { updateCompany } = require('../../repos')
const { getHeadquarterOptions } = require('./repos')
const { getOptions } = require('../../../../lib/options')
const urls = require('../../../../lib/urls')
const {
  transformCompanyToForm,
  transformFormToApi,
  transformFormToZendesk,
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

function createUpdateRequests(formValues, req, res) {
  const { company } = res.locals
  const transformedCompanyValues = transformCompanyToForm(company)
  return Object.keys(formValues).map((fieldName) =>
    postToZenDesk(
      createUpdateRequestMessage(
        transformedCompanyValues[fieldName],
        formValues[fieldName],
        fieldName,
        req,
        res
      )
    )
  )
}

function createUpdateRequestMessage(oldValue, newValue, fieldName, req, res) {
  const { company, user } = res.locals
  const companyUrl = url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: urls.companies.detail(company.id),
  })

  const messageBody =
    `User ${user.name} requested company details change of ${company.name} (${companyUrl})\n\n` +
    `Current ${fieldName}: ${oldValue}\n` +
    `Requested ${fieldName}: ${newValue}\n`

  return {
    type: ZENDESK_TICKET_TYPE_TASK,
    requester: {
      name: `Data Hub user - ${user.name}`,
      email: user.email,
    },
    subject: `Change request of ${fieldName} for ${company.name}`,
    comment: {
      body: messageBody,
    },
    tags: [ZENDESK_TICKET_TAG_CHANGE_REQUEST],
  }
}

async function postEditCompany(req, res, next) {
  try {
    const { company } = res.locals
    const apiRequestFields = transformFormToApi(company, req.body)
    const zendeskRequestFields = transformFormToZendesk(company, req.body)

    if (company.duns_number) {
      const [, ...zendeskResponses] = await Promise.all([
        updateCompany(req.session.token, company.id, apiRequestFields),
        ...createUpdateRequests(zendeskRequestFields, req, res),
      ])

      req.flash(
        'success',
        'Update sent for review. Thanks for keeping Data Hub running smoothly.'
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
