module.exports = {
  url: process.env.QA_HOST,
  props: {
    parentCompanySearchTerm: 'Apple',
  },
  elements: {
    searchField: '#field-term',
    searchForm: '.c-entity-search__button',
    addNewCompanyButton: 'a[href*="/companies/add-step"]',
    companyAddForm: '.c-form-actions button',
    radioLabelUKLtd: 'label[for=field-business_type-1]',
    radioLabelForeignOrg: 'label[for=field-business_type-3]',
    radioLabelUKOtherOrg: 'label[for=field-business_type-2]',
    businessTypeForeignDropdownOptionCharity: '#field-business_type_for_other option[value="Charity"]',
    businessTypeUKOtherDropdownOptionCharity: '#field-business_type_uk_other option[value="Charity"]',
    newCompanyNameField: '#name',
    newCompanyTradingNameField: '#trading_name',
    newCompanyRegisteredAddress1Field: '#registered_address_1',
    newCompanyRegisteredAddress2Field: '#registered_address_2',
    newCompanyTownField: '#registered_address_town',
    newCompanyCountyField: '#registered_address_county',
    newCompanyCountryField: '#registered_address_country',
    newCompanyPostcodeField: '#registered_address_postcode',
    newCompanyCountryFieldOptionForeign: {
      selector: '//select[@id="registered_address_country"]/option[normalize-space(.)="Turkey"]',
      locateStrategy: 'xpath',
    },
    newCompanyCountryFieldOptionUK: {
      selector: '//select[@id="registered_address_country"]/option[normalize-space(.)="United Kingdom"]',
      locateStrategy: 'xpath',
    },
    newCompanyCountryFieldOptionUKRegionEngland: {
      selector: '//select[@id="uk_region"]/option[normalize-space(.)="England"]',
      locateStrategy: 'xpath',
    },
    newCompanyHeadquartersRadioLabel: {
      selector: '(//input[@name="headquarters"])[1]/parent::*',
      locateStrategy: 'xpath',
    },
    newCompanySectorField: {
      selector: '//*[@id="main-content"]/div/article/form/div[5]/select',
      locateStrategy: 'xpath',
    },
    newCompanySectorOption: '#sector option:nth-child(16)',
    newCompanyWebsiteField: '#website',
    newCompanyDescription: '#description',
    newCompanyNumberOfEmployeesField: '#employee_range',
    newCompanyAnnualTurnoverField: '#turnover_range',
    newCompanySearch: '#field-term',
    parentCompanyResultItem: '.results-list__result:first-child a',
    parentCompanyResultItemChooseButton: '.results-list__result:first-child .panel .button',
    flashMessage: '.c-message-list li:first-child',
    collectionsCompanyNameInput: '#field-name',
    collectionResultsCompanyName: '.c-entity-list li:first-child .c-entity__title > a',
    collectionResultsSectorLabel: '.c-entity-list li:first-child .c-entity__content .c-meta-list > div:first-child .c-meta-list__item-label',
    collectionResultsRegisteredAddressLabel: '.c-entity-list li:first-child .c-entity__content .c-meta-list > div:last-child .c-meta-list__item-label',
    collectionResultsRegionLabel: '.c-entity-list li:first-child .c-entity__badges .c-meta-list > div:last-child .c-meta-list__item-label',
    xhrTargetElement: '#xhr-outlet',
    companyPageHeading: 'h1.c-local-header__heading',
  },
  commands: [
    {
      findCompany (companyName) {
        return this
          .setValue('@searchField', companyName)
          .submitForm('@searchForm')
      },

      createForeignCompany (companyName) {
        this.companyName = companyName
        return this
          .click('@addNewCompanyButton')
          // step 1
          .click('@radioLabelForeignOrg')
          .click('@businessTypeForeignDropdownOptionCharity')
          .submitForm('@companyAddForm')
          // step 2
          .setValue('@newCompanyNameField', companyName)
          .setValue('@newCompanyRegisteredAddress1Field', '‎‎253 Sok')
          .setValue('@newCompanyPostcodeField', '48300')
          .setValue('@newCompanyTownField', 'Istanbul')
          .click('@newCompanyCountryFieldOptionForeign')
          .click('@newCompanyHeadquartersRadioLabel')
          .click('@newCompanySectorOption')
          .setValue('@newCompanyWebsiteField', 'http://example.com')
          .submitForm('form')
      },

      createUkNonPrivateOrNonPublicLimitedCompany (companyName) {
        this.companyName = companyName
        return this
          .click('@addNewCompanyButton')
          // step 1
          .click('@radioLabelUKOtherOrg')
          .click('@businessTypeUKOtherDropdownOptionCharity')
          .submitForm('@companyAddForm')
          // step 2
          .setValue('@newCompanyNameField', companyName)
          .setValue('@newCompanyRegisteredAddress1Field', '1 Regents Street')
          .setValue('@newCompanyPostcodeField', 'W1C 2GB')
          .setValue('@newCompanyTownField', 'London')
          .click('@newCompanyCountryFieldOptionUK')
          .click('@newCompanyCountryFieldOptionUKRegionEngland')
          .click('@newCompanyHeadquartersRadioLabel')
          .click('@newCompanySectorOption')
          .setValue('@newCompanyWebsiteField', 'http://example.com')
          .submitForm('form')
      },

      createUkPrivateOrPublicLimitedCompany (companyName) {
        this.companyName = companyName
        return this
          .click('@addNewCompanyButton')
          // step 1
          .click('@radioLabelUKLtd')
          .submitForm('@companyAddForm')
          // step 2
          .setValue('@newCompanySearch', this.props.parentCompanySearchTerm)
          .submitForm('form')
          // step 3
          .click('@parentCompanyResultItem')
          .click('@parentCompanyResultItemChooseButton')
          // step 4
          .setValue('@newCompanyTradingNameField', companyName)
          .click('@newCompanyCountryFieldOptionUKRegionEngland')
          .click('@newCompanyHeadquartersRadioLabel')
          .click('@newCompanySectorOption')
          .setValue('@newCompanyWebsiteField', 'http://example.com')
          .submitForm('form')
      },

      searchForCompanyInCollection (companyName) {
        this.api.url(`${process.env.QA_HOST}/companies`)
        return this
          .waitForElementPresent('@collectionsCompanyNameInput')
          .setValue('@collectionsCompanyNameInput', [ companyName, this.api.Keys.ENTER ]) // press enter
          .waitForElementNotVisible('@xhrTargetElement') // wait for xhr results to come back
          .waitForElementVisible('@xhrTargetElement')
      },
    },
  ],
}
