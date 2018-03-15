module.exports = {
  url: `${process.env.QA_HOST}/omis/create/sector`,
  elements: {
    companySector: '.c-message--muted strong',
    useCompanySectorOption: 'label[for="field-use_sector_from_company-1"]',
    useCustomSectorOption: 'label[for="field-use_sector_from_company-2"]',
    sectorField: '[name="sector"]',
  },
}
