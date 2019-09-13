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
      business: 'input[type="radio"][value="business"]',
      charity: 'input[type="radio"][value="charity"]',
      publicBody: 'input[type="radio"][value="publicbody"]',
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
