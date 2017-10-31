const faker = require('faker')
const { assign } = require('lodash')

const { getSelectorForElementWithText, getButtonWithText } = require('../../../helpers/selectors')

const getDetailsTabSelector = (text) => getSelectorForElementWithText(
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
  elements: {
    searchField: '#field-term',
    searchForm: '.c-entity-search__button',
    addCompanyButton: getButtonWithText('Add company'),
    addInteractionButton: getButtonWithText('Add interaction'),
    continueButton: getButtonWithText('Continue'),
    addButton: getButtonWithText('Add'),
    saveAndCreateButton: getButtonWithText('Save and create'),
    ukPrivateOrPublicLimitedCompanyOption: 'label[for=field-business_type-1]',
    otherTypeOfUKOrganisationOption: 'label[for=field-business_type-2]',
    otherTypeOfUKOrganisationBusinessType: 'select[name="business_type_uk_other"]',
    foreignOrganisationOption: 'label[for=field-business_type-3]',
    foreignOrganisationOptionBusinessType: 'select[name="business_type_for_other"]',
    name: '#field-name',
    tradingName: '#field-trading_name',
    ukRegion: 'select[name="uk_region"]',
    address1: '#field-registered_address_1',
    address2: '#field-registered_address_2',
    town: '#field-registered_address_town',
    county: '#field-registered_address_county',
    registeredAddressCountry: 'select[name="registered_address_country"]',
    postcode: '#field-registered_address_postcode',
    headquartersOption: 'label[for=field-headquarter_type-2]',
    sector: '#field-sector',
    website: '#field-website',
    parentCompanySearch: '#field-term',
    flashMessage: '.c-message-list li:first-child',
    collectionsCompanyNameInput: '#field-name',
    collectionResultsCompanyName: '.c-entity-list li:first-child .c-entity__title > a',
    collectionResultsSectorLabel: '.c-entity-list li:first-child .c-entity__content .c-meta-list > div:first-child .c-meta-list__item-label',
    collectionResultsRegisteredAddressLabel: '.c-entity-list li:first-child .c-entity__content .c-meta-list > div:last-child .c-meta-list__item-label',
    collectionResultsRegionLabel: '.c-entity-list li:first-child .c-entity__badges .c-meta-list > div:last-child .c-meta-list__item-label',
    xhrTargetElement: '#xhr-outlet',
    pageHeading: 'h1.c-local-header__heading',
  },
  commands: [
    {
      findCompany (companyName) {
        return this
          .waitForElementVisible('@searchField')
          .setValue('@searchField', companyName)
          .submitForm('@searchForm')
          .waitForElementVisible('@addCompanyButton')
      },

      createForeignCompany (details = {}, callback) {
        const company = assign({}, {
          address1: faker.address.streetName(),
          postcode: faker.address.zipCode(),
          town: faker.address.city(),
          website: faker.internet.url(),
        }, details)

        this
          .click('@addCompanyButton')
          .waitForElementPresent('@otherTypeOfUKOrganisationBusinessType')
          .waitForElementPresent('@foreignOrganisationOptionBusinessType')
          .api.perform((done) => {
            // step 1
            this
              .click('@foreignOrganisationOption')
              .api.perform((done) => {
                this.getListOption('@foreignOrganisationOptionBusinessType', (businessType) => {
                  this.setValue(`@foreignOrganisationOptionBusinessType`, businessType)
                  done()
                })
              })

            // step 2
            this
              .waitForElementPresent('@continueButton')
              .click('@continueButton')
              .waitForElementPresent('@pageHeading')
              .api.perform((done) => {
                this.getListOption('@registeredAddressCountry', (country) => {
                  company.registeredAddressCountry = country
                  done()
                })
              })
              .perform((done) => {
                this.getListOption('@sector', (sector) => {
                  company.sector = sector
                  done()
                })
              })
              .perform((done) => {
                for (const key in company) {
                  if (company[key]) {
                    this.setValue(`@${key}`, company[key])
                  }
                }
                done()
              })

            this
              .waitForElementPresent('@saveAndCreateButton')
              .click('@saveAndCreateButton')
            done()
          })

        callback(company)
        return this
      },

      createUkNonPrivateOrNonPublicLimitedCompany (details = {}, callback) {
        const company = assign({}, {
          address1: faker.address.streetName(),
          postcode: faker.address.zipCode(),
          town: faker.address.city(),
        }, details)

        this
          .click('@addCompanyButton')
          .waitForElementPresent('@otherTypeOfUKOrganisationBusinessType')
          .waitForElementPresent('@foreignOrganisationOptionBusinessType')
          .api.perform((done) => {
            // step 1
            this
              .click('@otherTypeOfUKOrganisationOption')
              .api.perform((done) => {
                this.getListOption('@otherTypeOfUKOrganisationBusinessType', (businessType) => {
                  this.setValue(`@otherTypeOfUKOrganisationBusinessType`, businessType)
                  done()
                })
              })

            // step 2
            this
              .waitForElementPresent('@continueButton')
              .click('@continueButton')
              .waitForElementPresent('@pageHeading')
              .api.perform((done) => {
                this.getListOption('@ukRegion', (ukRegion) => {
                  company.ukRegion = ukRegion
                  done()
                })
              })
              .perform((done) => {
                this.getListOption('@sector', (sector) => {
                  company.sector = sector
                  done()
                })
              })
              .perform((done) => {
                for (const key in company) {
                  if (company[key]) {
                    this.setValue(`@${key}`, company[key])
                  }
                }
                done()
              })

            this
              .waitForElementPresent('@saveAndCreateButton')
              .click('@saveAndCreateButton')
            done()
          })

        callback(company)
        return this
      },

      createUkPrivateOrPublicLimitedCompany (parentCompany, company = {}, callback) {
        this
          .click('@addCompanyButton')
          .waitForElementPresent('@otherTypeOfUKOrganisationBusinessType')
          .waitForElementPresent('@foreignOrganisationOptionBusinessType')
          .api.perform(async (done) => {
            // step 1
            this
              .click('@ukPrivateOrPublicLimitedCompanyOption')
              .click('@continueButton')

            // step 2
              .setValue('@parentCompanySearch', parentCompany)
              .submitForm('form')

            // step 3
            this.section.firstCompanySearchResult
              .click('@header')
            this
              .click('@addButton')

            // step 4
            this
              .waitForElementPresent('@pageHeading')
              .api.perform((done) => {
                this.getListOption('@ukRegion', (ukRegion) => {
                  company.ukRegion = ukRegion
                  done()
                })
              })
              .perform((done) => {
                this.getListOption('@sector', (sector) => {
                  company.sector = sector
                  done()
                })
              })
              .perform((done) => {
                for (const key in company) {
                  if (company[key]) {
                    this.setValue(`@${key}`, company[key])
                  }
                }
                done()
              })
            this.click('@saveAndCreateButton')
            done()
          })

        callback(company)
        return this
      },

      searchForCompanyInCollection (companyName) {
        this.api.url(`${process.env.QA_HOST}/companies`)
        return this
          .waitForElementPresent('@collectionsCompanyNameInput')
          .setValue('@collectionsCompanyNameInput', [companyName, this.api.Keys.ENTER]) // press enter
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
    firstCompanySearchResult: {
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
