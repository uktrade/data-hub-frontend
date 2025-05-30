module.exports = {
  title: 'h1',
  form: 'form',
  continueButton: 'form button:contains("Continue")',
  submitButton: 'form button:contains("Add company")',
  backButton: 'form button:contains("Back")',
  stepHeader: 'form h3',
  summary: 'form dl',
  regionSelect: 'form select#uk_region',
  sectorSelect: 'form select#sector',

  entitySearch: {
    companyNameField: 'input[name="companyDnB"]',
    selectCompanyButton: '[data-test="select-company-button"]',
    results: {
      someCompanyName: '[data-test="typeahead-menu-option"]:nth-child(1)',
      someOtherCompany: '[data-test="typeahead-menu-option"]:nth-child(2)',
      companyUnknownPostcode:
        '[data-test="typeahead-menu-option"]:nth-child(3)',
    },
    cannotFind: {
      summary: 'details summary span',
      stillCannotFind: `button:contains("I still can't find what I'm looking for")`,
    },
    outOfBusiness: '[data-test="company-out-of-business"]',
    alreadyOnDatahub: '[data-test="company-already-on-datahub"]',
  },
  newCompanyRecordForm: {
    whyAmISeeingThis: {
      summary: 'details summary span',
    },
    companyName: 'input[name="name"]',
    companyNameContainer: '#field-name',
    website: 'input[name="website"]',
    websiteContainer: '#field-website',
    telephone: 'input[name="telephone_number"]',
    telephoneContainer: '#field-telephone_number',
    address: {
      postcode: 'input[name="postcode"]',
      findUkAddress: 'form button:contains("Find UK address")',
      options: 'label:contains("Select an address") select',
    },
    region: 'select#uk_region',
    sector: 'select#sector',
    areaUS: 'select#area',
    areaCanada: 'select#areaCanada',
    companyLocation: '[data-test="field-companyLocation"]',
    dbtRegion: '[data-test="field-uk_region"]',
    dbtSector: '[data-test="field-sector"]',
  },
}
