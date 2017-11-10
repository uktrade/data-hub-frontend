const { get, isEmpty } = require('lodash')

const metadata = require('../../../../lib/metadata')
const {
  buildMetaDataObj,
  transformObjectToOption,
} = require('../../../transformers')

function renderInvestmentTypePage (req, res) {
  return res
    .breadcrumb('Add investment project')
    .render('investment-projects/views/create/investment-type')
}

function renderInvestmentInfoPage (req, res) {
  return res
    .breadcrumb('Add investment project')
    .render('investment-projects/views/create/info')
}

function postHandler (req, res, next) {
  const errorMessages = get(res.locals, 'form.errors.messages')

  if (!isEmpty(errorMessages)) {
    res.locals.form.state = Object.assign({}, req.body)
    return next()
  }

  const investmentTypeId = req.body.investment_type
  const companyId = req.body.company_id
  const investmentTypeOptions = buildMetaDataObj(metadata.investmentTypeOptions.map(transformObjectToOption))

  req.store('investment_details', {
    'investment_type': investmentTypeId,
    'fdi_type': req.body.fdi_type,
  })

  if (
    investmentTypeId === investmentTypeOptions.fdi.value ||
    investmentTypeId === investmentTypeOptions.non_fdi.value
  ) {
    return res.redirect(`/investment-projects/create/equity-source/${companyId}`)
  }

  if (investmentTypeId === investmentTypeOptions.commitment_to_invest.value) {
    // TODO commitment to invest create flow
  }

  next()
}

module.exports = {
  postHandler,
  renderInvestmentInfoPage,
  renderInvestmentTypePage,
}
