const { isEmpty } = require('lodash')

const config = require('../../../../config')
const { updateCompany, createDnbChangeRequest } = require('../../repos')
const { getHeadquarterOptions } = require('./repos')
const { getOptions } = require('../../../../lib/options')
const urls = require('../../../../lib/urls')
const {
  transformCompanyToForm,
  transformFormToApi,
  transformFormToDnbChangeRequest,
} = require('./transformers')
const { isItaTierDAccount } = require('../../../../lib/is-tier-type-company')

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

async function postEditCompany(req, res, next) {
  try {
    const { company } = res.locals
    const { token } = req.session

    const dataHubChanges = transformFormToApi(company, req.body)

    const dnbChanges = company.duns_number
      ? transformFormToDnbChangeRequest(company, req.body)
      : {}

    // No changes
    if (isEmpty(dataHubChanges) && isEmpty(dnbChanges)) {
      return res.json({})
    }

    // Only D&B changes
    if (isEmpty(dataHubChanges) && !isEmpty(dnbChanges)) {
      const dnbChangeRequest = await createDnbChangeRequest(
        token,
        company.duns_number,
        dnbChanges
      )

      req.flashWithBody(
        'success',
        'Change requested.',
        'Thanks for keeping Data Hub running smoothly.',
        'message-company-change-request'
      )

      return res.json({ dnbChangeRequest })
    }

    // Only Data Hub changes
    if (!isEmpty(dataHubChanges) && isEmpty(dnbChanges)) {
      const updatedCompany = await updateCompany(
        token,
        company.id,
        dataHubChanges
      )

      req.flash('success', 'Company record updated')

      return res.json({ company: updatedCompany })
    }

    // Both D&B and Data Hub changes
    if (!isEmpty(dataHubChanges) && !isEmpty(dnbChanges)) {
      const updatedCompany = await updateCompany(
        token,
        company.id,
        dataHubChanges
      )

      const dnbChangeRequest = await createDnbChangeRequest(
        token,
        company.duns_number,
        dnbChanges
      )

      req.flashWithBody(
        'success',
        'Change requested.',
        'Thanks for keeping Data Hub running smoothly.',
        'message-company-change-request'
      )

      res.json({
        company: updatedCompany,
        dnbChangeRequest,
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderEditCompanyForm,
  postEditCompany,
}
