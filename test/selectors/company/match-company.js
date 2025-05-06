module.exports = {
  form: 'form',
  find: {
    companyNameInput: 'input[name="companyDnB"]',
    postcodeField: 'input[name="dnbPostalCode"]',
    button: '[data-test="select-company-button"]',
    results: {
      someCompany: '[data-test="typeahead-menu-option"]:nth-child(1)',
      someOtherCompany: '[data-test="typeahead-menu-option"]:nth-child(2)',
    },
  },
}
