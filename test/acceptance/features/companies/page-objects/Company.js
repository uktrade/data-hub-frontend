const faker = require('faker')
const { assign } = require('lodash')

const { getSelectorForElementWithText, getButtonWithText } = require('../../../helpers/selectors')
const { appendUid } = require('../../../helpers/uuid')

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

const getTableRowValue = (text) => getSelectorForElementWithText(
  text,
  {
    el: '//th',
    child: '/following-sibling::td',
  }
)

module.exports = {
  url: process.env.QA_HOST,
  elements: {
    searchField: '#field-term',
    searchForm: '.c-entity-search__button',
    addCompanyButton: getButtonWithText('Add company'),
    addContactButton: getButtonWithText('Add contact'),
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
    sector: '#field-sector',
    website: '#field-website',
    description: '#field-description',
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
          name: appendUid(faker.company.companyName()),
          address1: faker.address.streetName(),
          postcode: faker.address.zipCode(),
          town: faker.address.city(),
          website: faker.internet.url(),
          description: faker.lorem.sentence(),
        }, details)
        const companyRadioButtons = {}

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
                this.getRadioOption('headquarter_type', (result) => {
                  companyRadioButtons.headquarterType = result
                  done()
                })
              })
              .perform((done) => {
                this.getRadioOption('employee_range', (result) => {
                  companyRadioButtons.employeeRange = result
                  done()
                })
              })
              .perform((done) => {
                this.getRadioOption('turnover_range', (result) => {
                  companyRadioButtons.turnoverRange = result
                  done()
                })
              })
              .perform(() => {
                for (const key in company) {
                  if (company[key]) {
                    this.setValue(`@${key}`, company[key])
                  }
                }
                for (const key in companyRadioButtons) {
                  this.api.useCss().click(companyRadioButtons[key].labelSelector)
                  company[key] = companyRadioButtons[key].text
                }
              })
              .perform(() => {
                this
                  .waitForElementPresent('@saveAndCreateButton')
                  .click('@saveAndCreateButton')

                const { address1, town, postcode, registeredAddressCountry } = company
                callback(assign({}, company, {
                  header: company.name,
                  primaryAddress: `${address1}, ${town}, ${postcode}, ${registeredAddressCountry}`,
                }))
              })

            done()
          })

        return this
      },

      createUkNonPrivateOrNonPublicLimitedCompany (details = {}, callback) {
        const companyStep1 = {}
        const companyStep2 = assign({}, {
          name: appendUid(faker.company.companyName()),
          address1: faker.address.streetName(),
          postcode: faker.address.zipCode(),
          town: faker.address.city(),
          website: faker.internet.url(),
          description: faker.lorem.sentence(),
        }, details)
        const companyStep2RadioOptions = {}

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
                  companyStep1.businessType = businessType
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
                  companyStep2.ukRegion = ukRegion
                  done()
                })
              })
              .perform((done) => {
                this.getListOption('@sector', (sector) => {
                  companyStep2.sector = sector
                  done()
                })
              })
              .perform((done) => {
                this.getRadioOption('headquarter_type', (result) => {
                  companyStep2RadioOptions.headquarterType = result
                  done()
                })
              })
              .perform((done) => {
                this.getRadioOption('employee_range', (result) => {
                  companyStep2RadioOptions.employeeRange = result
                  done()
                })
              })
              .perform((done) => {
                this.getRadioOption('turnover_range', (result) => {
                  companyStep2RadioOptions.turnoverRange = result
                  done()
                })
              })
              .perform(() => {
                for (const key in companyStep2) {
                  if (companyStep2[key]) {
                    this.setValue(`@${key}`, companyStep2[key])
                  }
                }
                for (const key in companyStep2RadioOptions) {
                  this.api.useCss().click(companyStep2RadioOptions[key].labelSelector)
                  companyStep2[key] = companyStep2RadioOptions[key].text
                }
              })
              .perform(() => {
                this
                  .waitForElementPresent('@saveAndCreateButton')
                  .click('@saveAndCreateButton')

                const { address1, town } = companyStep2
                const country = 'United Kingdom'
                callback(assign({}, companyStep1, companyStep2, {
                  country,
                  header: companyStep2.name,
                  primaryAddress: `${address1}, ${town}, ${country}`,
                }))
              })
            done()
          })

        return this
      },

      createUkPrivateOrPublicLimitedCompany (parentCompany, details = {}, callback) {
        const company = assign({}, {
          tradingName: appendUid(faker.company.companyName()),
          website: faker.internet.url(),
          description: faker.lorem.sentence(),
        }, details)
        const companyRadioButtons = {}

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
              .setValue('@parentCompanySearch', parentCompany.name)
              .submitForm('form')

            // step 3
            this.section.firstCompanySearchResult
              .click('@header')

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
                this.getRadioOption('headquarter_type', (result) => {
                  companyRadioButtons.headquarterType = result
                  done()
                })
              })
              .perform((done) => {
                this.getRadioOption('employee_range', (result) => {
                  companyRadioButtons.employeeRange = result
                  done()
                })
              })
              .perform((done) => {
                this.getRadioOption('turnover_range', (result) => {
                  companyRadioButtons.turnoverRange = result
                  done()
                })
              })
              .perform(() => {
                for (const key in company) {
                  if (company[key]) {
                    this.setValue(`@${key}`, company[key])
                  }
                }
                for (const key in companyRadioButtons) {
                  this.api.useCss().click(companyRadioButtons[key].labelSelector)
                  company[key] = companyRadioButtons[key].text
                }
              })
              .perform(() => {
                this
                  .waitForElementPresent('@saveAndCreateButton')
                  .click('@saveAndCreateButton')

                const { address1, town, postcode, country } = parentCompany
                callback(assign({}, company, {
                  header: company.name,
                  primaryAddress: `${address1}, ${town}, ${postcode}, ${country}`,
                }))
              })
            done()
          })

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
    firstContactsTabContact: {
      selector: '.c-entity-list li:first-child',
      elements: {
        header: {
          selector: 'a',
        },
        updated: getMetaListItemValueSelector('Updated'),
      },
    },
    companyDetails: {
      selector: '.table--key-value',
      elements: {
        businessType: getTableRowValue('Business type'),
        primaryAddress: getTableRowValue('Primary address'),
        ukRegion: getTableRowValue('UK region'),
        headquarters: getTableRowValue('Headquarters'),
        sector: getTableRowValue('Sector'),
        website: getTableRowValue('Website'),
        businessDescription: getTableRowValue('Business description'),
        numberOfEmployees: getTableRowValue('Number of employees'),
        annualTurnover: getTableRowValue('Annual turnover'),
        cdmsReference: getTableRowValue('CDMS reference'),
      },
    },
  },
}
