module.exports = {
  form: 'form',
  nextButton: 'form button:contains("Next")',
  submitButton: 'form button:contains("Add company")',
  backButton: 'form button:contains("Back")',
  subheader: 'form p',
  stepHeader: 'form h3',
  entitySearch: {
    searchButton: 'form button:contains("Search")',
    results: {
      someCompanyName: 'form ol li:nth-child(1)',
      someOtherCompany: 'form ol li:nth-child(2)',
    },
    cannotFind: {
      summary: 'details summary span',
      stillCannotFind: 'a:contains("I still cannot find the company")',
    },
  },
  newCompanyRecordForm: {
    whyAmISeeingThis: {
      summary: 'details summary span',
    },
    organisationType: {
      charity: 'input[type="radio"][value="9dd14e94-5d95-e211-a939-e4115bead28a"]',
      governmentDepartmentOrOtherPublicBody: 'input[type="radio"][value="9cd14e94-5d95-e211-a939-e4115bead28a"]',
      limitedCompany: 'input[type="radio"][value="98d14e94-5d95-e211-a939-e4115bead28a"]',
      limitedPartnership: 'input[type="radio"][value="8b6eaf7e-03e7-e611-bca1-e4115bead28a"]',
      partnership: 'input[type="radio"][value="9ad14e94-5d95-e211-a939-e4115bead28a"]',
      soleTrader: 'input[type="radio"][value="99d14e94-5d95-e211-a939-e4115bead28a"]',
    },
    name: '#name input',
    website: '#website input',
    telephone: '#telephone input',
    region: 'label[name="region"] select',
    sector: 'label[name="sector"] select',
  },
  companyDetails: {
    subheader: 'form h2',
  },
}
