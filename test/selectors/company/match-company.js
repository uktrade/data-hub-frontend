module.exports = {
  form: 'form',
  subHeader: 'form h3',
  find: {
    companyNameLabel: 'label[for="dnbCompanyName"]',
    companyNameInput: 'input[name="dnbCompanyName"]',
    companyNameError: '#field-dnbCompanyName > div > span',
    postcodeLabel: 'label[for="dnbPostalCode"]',
    postcodeField: 'input[name="dnbPostalCode"]',
    button: 'form button:contains("Find company")',
    results: {
      someCompany: 'form ol li:nth-child(1)',
      someOtherCompany: 'form ol li:nth-child(2)',
    },
  },
}
