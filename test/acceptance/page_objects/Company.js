module.exports = {
  url: process.env.QA_HOST,
  props: {
    parentCompanySearchTerm: 'Apple Cake',
  },
  elements: {
    searchField: '#search',
    searchForm: '.c-entity-search',
    searchResults: '.c-entity-list',
    searchResultsItem: '.c-entity-list__item',
    addNewCompanyButton: {
      selector: '//a[contains(@href, \'/companies/add-step-1/\')]',
      locateStrategy: 'xpath',
    },
    companyAddForm: '#company-add-form',
    radioLabelUKLtd: {
      selector: '//input[@id="ltd"]/parent::*',
      locateStrategy: 'xpath',
    },
    radioLabelForeignOrg: {
      selector: '//input[@id="foreign"]/parent::*',
      locateStrategy: 'xpath',
    },
    radioLabelUKOtherOrg: {
      selector: '//input[@id="ukother"]/parent::*',
      locateStrategy: 'xpath',
    },
    businessTypeForeignDropdownOptionCharity: '#business_type_for_other option[value="Charity"]',
    businessTypeUKOtherDropdownOptionCharity: '#business_type_uk_other option[value="Charity"]',
    newCompanyNameField: '#name',
    newCompanyTradingNameField: '#alias',
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
    newCompanySearch: '#search-term',
    parentCompanyResultItem: '.results-list__result:first-child a',
    parentCompanyResultItemChooseButton: '.results-list__result:first-child .panel .button',
    flashInfo: '.flash--info',
  },
  commands: [
    {
      findCompany (name) {
        return this
          .setValue('#search', name)
          .submitForm('@searchForm')
      },

      createForeignOrg (name) {
        this.newlyCreatedCompanyName = name
        return this
          .click('@addNewCompanyButton')
          // step 1
          .click('@radioLabelForeignOrg')
          .click('@businessTypeForeignDropdownOptionCharity')
          .submitForm('@companyAddForm')
          // step 2
          .setValue('@newCompanyNameField', name)
          .setValue('@newCompanyRegisteredAddress1Field', '‎‎253 Sok')
          .setValue('@newCompanyPostcodeField', '48300')
          .setValue('@newCompanyTownField', 'Istanbul')
          .click('@newCompanyCountryFieldOptionForeign')
          .click('@newCompanyHeadquartersRadioLabel')
          .click('@newCompanySectorOption')
          .setValue('@newCompanyWebsiteField', 'http://example.com')
          .submitForm('form')
      },

      createOtherTypeUKOrg (name) {
        this.newlyCreatedCompanyName = name
        return this
          .click('@addNewCompanyButton')
          // step 1
          .click('@radioLabelUKOtherOrg')
          .click('@businessTypeUKOtherDropdownOptionCharity')
          .submitForm('@companyAddForm')
          // step 2
          .setValue('@newCompanyNameField', name)
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

      createPrivateLimitedCompany (name) {
        this.newlyCreatedCompanyName = name
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
          .setValue('@newCompanyTradingNameField', name)
          .click('@newCompanyCountryFieldOptionUKRegionEngland')
          .click('@newCompanyHeadquartersRadioLabel')
          .click('@newCompanySectorOption')
          .setValue('@newCompanyWebsiteField', 'http://example.com')
          .submitForm('form')
      },
    },
  ],
}
