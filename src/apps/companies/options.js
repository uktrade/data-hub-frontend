const ukOtherCompanyOptions = [
  'Charity',
  'Government department',
  'Intermediary',
  'Limited partnership',
  'Partnership',
  'Sole trader',
].map(item => {
  return {
    value: item,
    label: item,
  }
})

const foreignOtherCompanyOptions = [{ value: 'Company', label: 'Company' }, ...ukOtherCompanyOptions]

module.exports = {
  ukOtherCompanyOptions,
  foreignOtherCompanyOptions,
}
