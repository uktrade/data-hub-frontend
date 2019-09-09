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
  },
  companyDetails: {
    subheader: 'form h2',
  },
}
