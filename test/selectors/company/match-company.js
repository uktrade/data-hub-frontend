module.exports = {
  form: 'form',
  find: {
    companyNameInput: 'input[name="dnbCompanyName"]',
    postcodeField: 'input[name="dnbPostalCode"]',
    button: 'form button:contains("Find company")',
    results: {
      someCompany: 'form ol li:nth-child(1)',
      someOtherCompany: 'form ol li:nth-child(2)',
    },
  },
}
