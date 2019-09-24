module.exports = {
  form: 'form',
  continueButton: 'form button:contains("Continue")',
  submitButton: 'form button:contains("Add company")',
  backButton: 'form button:contains("Back")',
  subheader: 'form p',
  stepHeader: 'form h3',
  summary: 'form dl',
  entitySearch: {
    companyNameField: 'input[name="dnbCompanyName"]',
    postalCodeField: 'input[name="dnbPostalCode"]',
    searchButton: 'form button:contains("Find company")',
    results: {
      someCompanyName: 'form ol li:nth-child(1)',
      someOtherCompany: 'form ol li:nth-child(2)',
    },
    cannotFind: {
      summary: 'details summary span',
      stillCannotFind: 'button:contains("I still cannot find the company")',
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
    companyName: 'input[name="name"]',
    website: 'input[name="website"]',
    telephone: 'input[name="telephone_number"]',
    address: {
      postcode: 'label[for="postcode"] ~ input',
      findUkAddress: 'form button:contains("Find UK address")',
      options: 'label[for="address"] ~ label select',
    },
    region: 'select#uk_region',
    sector: 'select#sector',
  },
  companyDetails: {
    subheader: 'form h2',
  },
}
