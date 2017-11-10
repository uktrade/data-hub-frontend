const metadata = require('../../../../lib/metadata')
const {
  buildMetaDataObj,
  transformObjectToOption,
} = require('../../../transformers')

function populateForm (req, res, next) {
  const investmentTypes = metadata.investmentTypeOptions.map(transformObjectToOption)

  res.locals.form = res.locals.form || {}
  res.locals.form.options = {
    investmentTypes,
    investmentTypesObj: buildMetaDataObj(investmentTypes),
    fdi: metadata.fdiOptions.map(transformObjectToOption),
  }

  next()
}

function validateForm (req, res, next) {
  const investmentTypeOptions = buildMetaDataObj(metadata.investmentTypeOptions.map(transformObjectToOption))
  const errors = {
    messages: {},
  }

  if (!req.body.investment_type) {
    errors.messages.investment_type = ['Please choose the type of investment for this project']
  }

  if (req.body.investment_type === investmentTypeOptions.fdi.value && !req.body.fdi_type) {
    errors.messages.fdi_type = ['Please choose FDI type']
  }

  res.locals.form = Object.assign({}, res.locals.form, {
    errors,
  })

  next()
}

module.exports = {
  populateForm,
  validateForm,
}
