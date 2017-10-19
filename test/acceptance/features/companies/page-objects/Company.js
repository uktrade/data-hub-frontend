const faker = require('faker')

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
    addCompanyButton: getButtonWithText('Add company'),
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
        this.state.companyDetails = {
          name: companyName,
          address1: faker.address.streetName(),
          postcode: faker.address.zipCode(),
          town: faker.address.city(),
          website: faker.internet.url(),
        }

        this
          .click('@addCompanyButton')
          .waitForElementPresent('@otherTypeOfUKOrganisationBusinessType')
          .waitForElementPresent('@foreignOrganisationOptionBusinessType')

        return this
          .api.perform(async (done) => {
            // step 1
            this.click('@foreignOrganisationOption')

            await new Promise((resolve) => {
              this.getListOption('@foreignOrganisationOptionBusinessType', (businessType) => {
                this.setValue(`@foreignOrganisationOptionBusinessType`, businessType)
                resolve()
              })
            })

            this.click('@continueButton')

            // step 2
            await new Promise((resolve) => {
              this.getListOption('@registeredAddressCountry', (country) => {
                this.state.companyDetails.registeredAddressCountry = country
                resolve()
              })
            })

            await new Promise((resolve) => {
              this.getListOption('@sector', (sector) => {
                this.state.companyDetails.sector = sector
                resolve()
              })
            })

            for (const key in this.state.companyDetails) {
              if (this.state.companyDetails[key]) {
                this.setValue(`@${key}`, this.state.companyDetails[key])
              }
            }

            this.click('@saveAndCreateButton')
            done()
          })
      },

      createUkNonPrivateOrNonPublicLimitedCompany (companyName) {
        this.state.companyDetails = {
          name: companyName,
          address1: faker.address.streetName(),
          postcode: faker.address.zipCode(),
          town: faker.address.city(),
        }

        this
          .click('@addCompanyButton')
          .waitForElementPresent('@otherTypeOfUKOrganisationBusinessType')
          .waitForElementPresent('@foreignOrganisationOptionBusinessType')

        return this
          .api.perform(async (done) => {
            // step 1
            this.click('@otherTypeOfUKOrganisationOption')

            await new Promise((resolve) => {
              this.getListOption('@otherTypeOfUKOrganisationBusinessType', (businessType) => {
                this.setValue(`@otherTypeOfUKOrganisationBusinessType`, businessType)
                resolve()
              })
            })

            this.click('@continueButton')

            // step 2
            await new Promise((resolve) => {
              this.getListOption('@registeredAddressCountry', (country) => {
                this.state.companyDetails.registeredAddressCountry = country
                resolve()
              })
            })

            await new Promise((resolve) => {
              this.getListOption('@sector', (sector) => {
                this.state.companyDetails.sector = sector
                resolve()
              })
            })

            for (const key in this.state.companyDetails) {
              if (this.state.companyDetails[key]) {
                this.setValue(`@${key}`, this.state.companyDetails[key])
              }
            }

            this.click('@saveAndCreateButton')
            done()
          })
      },

      createUkPrivateOrPublicLimitedCompany (companyName) {
        this.state.companyDetails = {
          tradingName: companyName,
        }

        this
          .click('@addCompanyButton')
          .waitForElementPresent('@otherTypeOfUKOrganisationBusinessType')
          .waitForElementPresent('@foreignOrganisationOptionBusinessType')

        return this
          .api.perform(async (done) => {
            // step 1
            this
              .click('@ukPrivateOrPublicLimitedCompanyOption')
              .click('@continueButton')

            // step 2
            this
              .setValue('@parentCompanySearch', this.props.parentCompanySearchTerm)
              .submitForm('form')

            // step 3
            this.section.firstParentCompanySearchResult
              .click('@header')
            this
              .click('@addButton')

            // step 4
            await new Promise((resolve) => {
              this.getListOption('@ukRegion', (ukRegion) => {
                this.state.companyDetails.ukRegion = ukRegion
                resolve()
              })
            })

            await new Promise((resolve) => {
              this.getListOption('@sector', (sector) => {
                this.state.companyDetails.sector = sector
                resolve()
              })
            })

            for (const key in this.state.companyDetails) {
              if (this.state.companyDetails[key]) {
                this.setValue(`@${key}`, this.state.companyDetails[key])
              }
            }

            this.click('@saveAndCreateButton')
            done()
          })
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
