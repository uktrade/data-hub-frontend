const metadata = require('../../../lib/metadata')
const { transformObjectToOption, transformStringToOption } = require('../../transformers')
const { macros } = require('./constants')
const { buildFormWithOptions } = require('../../builders')

const foreignOtherCompanyOptions = [
  'Charity',
  'Company',
  'Government dept',
  'Intermediary',
  'Limited partnership',
  'Partnership',
  'Sole trader',
]

function renderFormElements (req, res) {
  res.locals.macros = res.locals.macros || macros

  res.locals.macros.standardForm = buildFormWithOptions(res.locals.macros.standardForm, {
    country: metadata.countryOptions.map(transformObjectToOption),
    sector: metadata.sectorOptions.map(transformObjectToOption),
    strategicDrivers: metadata.strategicDriverOptions.map(transformObjectToOption),
    averageSalary: metadata.salaryRangeOptions.map(transformObjectToOption),
    foreignOtherCompany: foreignOtherCompanyOptions.map(transformObjectToOption),
  })

  return res
    .breadcrumb('Form elements')
    .render('components/views/form', {
      macros: res.locals.macros || macros,
      entitySearch: Object.assign({}, res.locals.entitySearch, {
        searchTerm: req.query.term,
      }),
      form: Object.assign({}, res.locals.form, {
        options: {
          countries: metadata.countryOptions.map(transformObjectToOption),
          averageSalaryRange: metadata.salaryRangeOptions.map(transformObjectToOption),
          strategicDrivers: metadata.strategicDriverOptions.map(transformObjectToOption),
          sectors: metadata.sectorOptions.map(transformObjectToOption),
          foreignOtherCompany: foreignOtherCompanyOptions.map(transformStringToOption),
        },
      }),
    })
}

module.exports = {
  renderFormElements,
}
