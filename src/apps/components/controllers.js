const metadata = require('../../lib/metadata')

function renderIndex (req, res) {
  return res.render('components/views/index', {
    title: 'Data Hub Components',
  })
}

function transformOption (option) {
  return {
    value: option.id,
    label: option.name,
  }
}

const foreignOtherCompanyOptions = [
  '-- Select type --',
  'Charity',
  'Company',
  'Government dept',
  'Intermediary',
  'Limited partnership',
  'Partnership',
  'Sole trader',
]

function renderFormElements (req, res) {
  return res.render('components/views/form', {
    title: 'Data Hub Form Elements',
    form: Object.assign({}, res.locals.form, {
      options: {
        countries: metadata.countryOptions.map(transformOption),
        averageSalaryRange: metadata.salaryRangeOptions.map(transformOption),
        strategicDrivers: metadata.strategicDriverOptions.map(transformOption),
        sectors: metadata.sectorOptions.map(transformOption),
        foreignOtherCompany: foreignOtherCompanyOptions.map(i => ({ value: i, label: i })),
      },
    }),
  })
}

module.exports = {
  renderIndex,
  renderFormElements,
}
