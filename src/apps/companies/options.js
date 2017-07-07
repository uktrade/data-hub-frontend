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

const foreignOtherCompanyOptions = [...ukOtherCompanyOptions]

module.exports = {
  ukOtherCompanyOptions,
  foreignOtherCompanyOptions,
}
