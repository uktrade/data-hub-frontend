/* eslint-disable camelcase */

const { get } = require('lodash')

const config = require('../../../../config')
const { transformCompanyToForm, transformFormToCompany } = require('./transformers')
const { updateCompany } = require('../../repos')
const { getHeadquarterOptions } = require('./repos')
const { getOptions } = require('../../../../lib/options')
const { isItaTierDAccount } = require('../../../../lib/is-tier-type-company')

// Foreign companies can have a UK branch.
const UK_BRANCH_OF_FOREIGN_COMPANY_ID = 'b0730fc6-fcce-4071-bdab-ba8de4f4fc98'

async function renderEditCompanyForm (req, res, next) {
  try {
    const { company } = res.locals
    const { token } = req.session

    const companyDetails = transformCompanyToForm(company)
    const businessType = get(company, 'business_type.id')
    const isOnOneList = !!(company.one_list_group_tier && !isItaTierDAccount(company))

    const [turnoverRanges, employeeRanges, regions, sectors, headquarterTypes] = await Promise.all([
      getOptions(token, 'turnover', { sorted: false }),
      getOptions(token, 'employee-range', { sorted: false }),
      getOptions(token, 'uk-region', { sorted: false }),
      getOptions(token, 'sector', { sorted: false }),
      getHeadquarterOptions(token),
    ])

    res
      .breadcrumb(company.name, `/companies/${company.id}`)
      .breadcrumb('Business details', `/companies/${company.id}/business-details`)
      .breadcrumb('Edit business details')
      .render('companies/apps/edit-company/views/client-container', {
        props: {
          isOnOneList,
          companyDetails,
          showCompanyNumberForUkBranch: businessType === UK_BRANCH_OF_FOREIGN_COMPANY_ID,
          oneListEmail: config.oneList.email,
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

async function postEditCompany (req, res, next) {
  try {
    const { company } = res.locals
    const transformed = transformFormToCompany(req.body)
    const result = await updateCompany(req.session.token, company.id, transformed)
    req.flash('success', 'Company record updated')
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderEditCompanyForm,
  postEditCompany,
}
