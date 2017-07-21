const ukOtherCompanyOptions = [
  'Charity',
  'Government dept',
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

const foreignOtherCompanyOptions = [{ label: 'Company', value: 'Company' }, ...ukOtherCompanyOptions]

module.exports = {
  ukOtherCompanyOptions,
  foreignOtherCompanyOptions,
}
