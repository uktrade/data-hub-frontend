const { getSelectorForElementWithText, getButtonWithText } = require('../../../helpers/selectors')

const getDetailsTabSelector = (text) =>
  getSelectorForElementWithText(
    text,
    {
      el: '//a',
      className: 'c-local-nav__link',
    }
  )

const getMetaListItemValueSelector = (text) => getSelectorForElementWithText(
  text,
  {
    el: '//span',
    className: 'c-meta-list__item-label',
    child: '/following-sibling::span',
  }
)

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
    addCompanyButton: getButtonWithText('Add company'),
    continueButton: getButtonWithText('Continue'),
    addButton: getButtonWithText('Add'),
    saveAndCreateButton: getButtonWithText('Save and create'),
    ukPrivateOrPublicLimitedCompanyRadioLabel: 'label[for=field-business_type-1]',
    otherTypeOfUKOrganisationsRadioLabel: 'label[for=field-business_type-2]',
    radioLabelForeignOrg: 'label[for=field-business_type-3]',
    businessTypeForeignDropdownOptionCharity: '#field-business_type_for_other option[value="Charity"]',
    businessTypeUKOtherDropdownOptionCharity: '#field-business_type_uk_other option[value="Charity"]',
    newCompanyNameField: '#field-name',
    newCompanyTradingNameField: '#field-trading_name',
    newCompanyRegisteredAddress1Field: '#field-registered_address_1',
    newCompanyRegisteredAddress2Field: '#field-registered_address_2',
    newCompanyTownField: '#field-registered_address_town',
    newCompanyCountyField: '#field-registered_address_county',
    newCompanyCountryField: '#field-registered_address_country',
    newCompanyPostcodeField: '#field-registered_address_postcode',
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
    newCompanyWebsiteField: '#field-website',
    newCompanyDescription: '#field-description',
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
        this.state.companyDetails = {
          businessType: 'Charity',
          name: companyName,
          address1: '1 Regents Street',
          postcode: 'W1C 2GB',
          town: 'London',
          country: 'United Kingdom',
          ukRegion: 'England',
          sector: 'Advanced Engineering',
        }

        this
          .click('@addCompanyButton')

        // step 1
        this
          .setValue('@otherTypeOfUKOrganisationsRadioLabel', '')
          .click('@otherTypeOfUKOrganisationsRadioLabel')
          .clickListOption('business_type_uk_other', this.state.companyDetails.businessType)
          .click('@continueButton')

        // step 2
        return this
          .setValue('@newCompanyNameField', this.state.companyDetails.name)
          .setValue('@newCompanyRegisteredAddress1Field', this.state.companyDetails.address1)
          .setValue('@newCompanyPostcodeField', this.state.companyDetails.postcode)
          .setValue('@newCompanyTownField', this.state.companyDetails.town)
          .clickListOption('registered_address_country', this.state.companyDetails.country)
          .clickListOption('uk_region', this.state.companyDetails.ukRegion)
          .clickListOption('sector', this.state.companyDetails.sector)
          .click('@saveAndCreateButton')
      },

      createUkPrivateOrPublicLimitedCompany (companyName) {
        this.state.companyDetails = {
          name: companyName,
          ukRegion: 'England',
          sector: 'Advanced Engineering',
        }

        this
          .click('@addCompanyButton')

        // step 1
        this
          .setValue('@ukPrivateOrPublicLimitedCompanyRadioLabel', '')
          .click('@ukPrivateOrPublicLimitedCompanyRadioLabel')
          .click('@continueButton')

        // step 2
        this
          .setValue('@newCompanySearch', this.props.parentCompanySearchTerm)
          .submitForm('form')

        // step 3
        this.section.firstParentCompanySearchResult
          .click('@header')
        this
          .click('@addButton')

        // step 4
        return this
          .setValue('@newCompanyTradingNameField', this.state.companyDetails.name)
          .clickListOption('uk_region', this.state.companyDetails.ukRegion)
          .clickListOption('sector', this.state.companyDetails.sector)
          .click('@saveAndCreateButton')
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
  sections: {
    detailsTabs: {
      selector: '.c-local-nav',
      elements: {
        details: getDetailsTabSelector('Details'),
        contacts: getDetailsTabSelector('Contacts'),
        interactions: getDetailsTabSelector('Interactions'),
        export: getDetailsTabSelector('Export'),
        investment: getDetailsTabSelector('Investment'),
        auditHistory: getDetailsTabSelector('Audit history'),
      },
    },
    firstParentCompanySearchResult: {
      selector: '.c-entity-list li:first-child',
      elements: {
        header: {
          selector: 'a',
        },
        companyNumber: getMetaListItemValueSelector('Company number'),
        natureOfBusiness: getMetaListItemValueSelector('Nature of business (SIC)'),
        type: getMetaListItemValueSelector('type'),
        incorporatedOn: getMetaListItemValueSelector('Incorporated on'),
      },
    },
  },
}
