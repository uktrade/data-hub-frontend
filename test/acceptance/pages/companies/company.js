const faker = require('faker')
const { assign } = require('lodash')

const {
  getMetaListItemValueSelector,
  getButtonWithText,
} = require('../../helpers/selectors')
const { appendUid, getUid } = require('../../helpers/uuid')
const { getAddress } = require('../../helpers/address')

module.exports = {
  url: process.env.QA_HOST,
  elements: {
    searchField: '#field-term',
    searchForm: '.c-entity-search__button',
    addCompanyButton: getButtonWithText('Add company'),
    continueButton: getButtonWithText('Continue'),
    saveAndCreateButton: getButtonWithText('Add company'),
    ukPrivateOrPublicLimitedCompanyOption: 'label[for=field-business_type-1]',
    otherTypeOfUKOrganisationOption: 'label[for=field-business_type-2]',
    otherTypeOfUKOrganisationBusinessType: 'select[name="business_type_uk_other"]',
    foreignOrganisationOption: 'label[for=field-business_type-3]',
    foreignOrganisationOptionBusinessType: 'select[name="business_type_for_other"]',
    name: '#field-name',
    companyNumber: '#field-company_number',
    tradingName: '#field-trading_names',
    ukRegion: 'select[name="uk_region"]',
    address1: '#field-address_1',
    address2: '#field-address_2',
    town: '#field-address_town',
    county: '#field-address_county',
    addressCountry: 'select[name="address_country"]',
    postcode: '#field-address_postcode',
    sector: '#field-sector',
    website: '#field-website',
    description: '#field-description',
    companiesHouseSearchField: '#field-term',
    collectionsCompanyNameInput: '#field-name',
    collectionResultsCompanyName: '.c-entity-list li:first-child .c-entity__title > a',
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
        const companyStep1 = {}
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
                  companyStep1.businessType = businessType
                  done()
                })
              })

            // step 2
            this
              .waitForElementPresent('@continueButton')
              .click('@continueButton')

            this.api.page.location().section.localHeader
              .waitForElementPresent('@header')

            this
              .api.perform((done) => {
                this.getListOption('@addressCountry', (country) => {
                  company.addressCountry = country
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
                this.getRadioOption({ name: 'headquarter_type', option: 'Not a headquarters' }, (result) => {
                  companyRadioButtons.headquarterType = result
                  done()
                })
              })
              .perform((done) => {
                this.getRadioOption({ name: 'employee_range' }, (result) => {
                  companyRadioButtons.employeeRange = result
                  done()
                })
              })
              .perform((done) => {
                this.getRadioOption({ name: 'turnover_range' }, (result) => {
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

                const { address1, town, postcode, addressCountry } = company
                callback(assign({}, company, {
                  heading: company.name,
                  primaryAddress: `${address1}, ${town}, ${postcode}, ${addressCountry}`,
                  uniqueSearchTerm: getUid(company.name),
                  country: company.addressCountry,
                  globalHeadquarters: companyRadioButtons.headquarterType.text !== 'Global HQ' ? 'Link the Global HQ' : '',
                  businessType: companyStep1.businessType,
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
          website: faker.internet.url(),
          description: faker.lorem.sentence(),
        }, details)
        const companyStep2RadioOptions = {}
        const postcodeLookup = {
          postcode: 'companyPostCode',
          address1: 'companyPostCodeLookupAddress1',
          address2: 'companyPostCodeLookupAddress2',
          town: 'companyPostCodeLookupTown',
          county: 'companyPostCodeLookupCounty',
        }

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
                  companyStep1.businessType = businessType === 'UK branch of foreign company (BR)'
                    ? 'Limited partnership'
                    : businessType
                  this.setValue(`@otherTypeOfUKOrganisationBusinessType`, companyStep1.businessType)
                  done()
                })
              })

            // step 2
            this
              .waitForElementPresent('@continueButton')
              .click('@continueButton')

            this.api.page.location().section.localHeader
              .waitForElementPresent('@header')

            this
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
                this.getRadioOption({ name: 'headquarter_type', option: 'Not a headquarters' }, (result) => {
                  companyStep2RadioOptions.headquarterType = result
                  done()
                })
              })
              .perform((done) => {
                this.getRadioOption({ name: 'employee_range' }, (result) => {
                  companyStep2RadioOptions.employeeRange = result
                  done()
                })
              })
              .perform((done) => {
                this.getRadioOption({ name: 'turnover_range' }, (result) => {
                  companyStep2RadioOptions.turnoverRange = result
                  done()
                })
              })
              .perform((done) => {
                for (const key in companyStep2) {
                  if (companyStep2[key]) {
                    this.setValue(`@${key}`, companyStep2[key])
                  }
                }
                for (const key in companyStep2RadioOptions) {
                  this.api.useCss().click(companyStep2RadioOptions[key].labelSelector)
                  companyStep2[key] = companyStep2RadioOptions[key].text
                }
                done()
              })

            this.api
              .perform((done) => {
                this.api
                  .page.address()
                  .getAddressInputValues('GL11 4DH', postcodeLookup, '@companyPostCodeLookupSuggestions', (addressInputValues) => {
                    const country = 'United Kingdom'
                    const primaryAddress = getAddress(assign({}, companyStep2, addressInputValues, { country }))

                    this
                      .waitForElementPresent('@saveAndCreateButton')
                      .click('@saveAndCreateButton')

                    callback(assign({}, companyStep1, companyStep2, {
                      addressInputValues,
                      heading: companyStep2.name,
                      primaryAddress,
                      country,
                      uniqueSearchTerm: getUid(companyStep2.name),
                      globalHeadquarters: companyStep2RadioOptions.headquarterType.text !== 'Global HQ' ? 'Link the Global HQ' : '',
                      businessType: companyStep1.businessType,
                    }))

                    done()
                  })
              })
            done()
          })

        return this
      },

      createUkPrivateOrPublicLimitedCompany (companiesHouseCompany, details = {}, callback) {
        const company = assign({}, {
          tradingName: appendUid(faker.company.companyName()),
          website: faker.internet.url(),
          description: faker.lorem.sentence(),
        }, details)
        const companyRadioButtons = {}

        return this
          .click('@addCompanyButton')
          .waitForElementPresent('@otherTypeOfUKOrganisationBusinessType')
          .waitForElementPresent('@foreignOrganisationOptionBusinessType')
          .api.perform(() => {
            // step 1
            this
              .waitForElementPresent('@ukPrivateOrPublicLimitedCompanyOption')
              .click('@ukPrivateOrPublicLimitedCompanyOption')
              .click('@continueButton')

            // step 2
              .waitForElementPresent('@companiesHouseSearchField')
              .setValue('@companiesHouseSearchField', companiesHouseCompany.name)
              .submitForm('form')

            // step 3
            this.section.firstCompanySearchResult
              .waitForElementPresent('@header')
              .click('@header')

            // step 4
            this.api.page.location().section.localHeader
              .waitForElementPresent('@header')

            this
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
                this.getRadioOption({ name: 'headquarter_type', option: 'Not a headquarters' }, (result) => {
                  companyRadioButtons.headquarterType = result
                  done()
                })
              })
              .perform((done) => {
                this.getRadioOption({ name: 'employee_range' }, (result) => {
                  companyRadioButtons.employeeRange = result
                  done()
                })
              })
              .perform((done) => {
                this.getRadioOption({ name: 'turnover_range' }, (result) => {
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

                callback(assign({}, company, {
                  heading: companiesHouseCompany.name,
                  primaryAddress: getAddress(companiesHouseCompany),
                  country: companiesHouseCompany.country,
                  uniqueSearchTerm: getUid(company.tradingName),
                  globalHeadquarters: companyRadioButtons.headquarterType.text !== 'Global HQ' ? 'Link the Global HQ' : '',
                }))
              })
          })
      },

      createUkBranchOfForeignCompany (details = {}, callback) {
        const companyStep1 = {}
        const companyStep2 = assign({}, {
          name: appendUid(faker.company.companyName()),
          companyNumber: `BR${faker.random.number({ min: 100000 })}`,
          website: faker.internet.url(),
          description: faker.lorem.sentence(),
        }, details)
        const companyStep2RadioOptions = {}
        const postcodeLookup = {
          postcode: 'companyPostCode',
          address1: 'companyPostCodeLookupAddress1',
          address2: 'companyPostCodeLookupAddress2',
          town: 'companyPostCodeLookupTown',
          county: 'companyPostCodeLookupCounty',
        }

        this
          .click('@addCompanyButton')
          .waitForElementPresent('@otherTypeOfUKOrganisationBusinessType')
          .api.perform((done) => {
            // step 1
            this
              .click('@otherTypeOfUKOrganisationOption')
              .api.perform(() => {
                const ukBranch = 'UK branch of foreign company (BR)'
                this.clickListOption('business_type_uk_other', ukBranch)

                companyStep1.businessType = ukBranch
              })

            // step 2
            this
              .waitForElementPresent('@continueButton')
              .click('@continueButton')

            this.api.page.location().section.localHeader
              .waitForElementPresent('@header')

            this
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
                this.getRadioOption({ name: 'headquarter_type', option: 'Not a headquarters' }, (result) => {
                  companyStep2RadioOptions.headquarterType = result
                  done()
                })
              })
              .perform((done) => {
                this.getRadioOption({ name: 'employee_range' }, (result) => {
                  companyStep2RadioOptions.employeeRange = result
                  done()
                })
              })
              .perform((done) => {
                this.getRadioOption({ name: 'turnover_range' }, (result) => {
                  companyStep2RadioOptions.turnoverRange = result
                  done()
                })
              })
              .perform((done) => {
                for (const key in companyStep2) {
                  if (companyStep2[key]) {
                    this.setValue(`@${key}`, companyStep2[key])
                  }
                }
                for (const key in companyStep2RadioOptions) {
                  this.api.useCss().click(companyStep2RadioOptions[key].labelSelector)
                  companyStep2[key] = companyStep2RadioOptions[key].text
                }
                done()
              })

            this.api
              .perform((done) => {
                this.api
                  .page.address()
                  .getAddressInputValues('GL11 4DH', postcodeLookup, '@companyPostCodeLookupSuggestions', (addressInputValues) => {
                    const country = 'United Kingdom'
                    const primaryAddress = getAddress(assign({}, companyStep2, addressInputValues, { country }))

                    this
                      .waitForElementPresent('@saveAndCreateButton')
                      .click('@saveAndCreateButton')

                    callback(assign({}, companyStep1, companyStep2, {
                      addressInputValues,
                      heading: companyStep2.name,
                      primaryAddress,
                      country,
                      uniqueSearchTerm: getUid(companyStep2.name),
                      globalHeadquarters: companyStep2RadioOptions.headquarterType.text !== 'Global HQ' ? 'Link the Global HQ' : '',
                      businessType: companyStep1.businessType,
                    }))

                    done()
                  })
              })
            done()
          })

        return this
      },

    },
  ],
  sections: {
    firstCompanySearchResult: {
      selector: '.c-collection > .c-entity-list li:first-child',
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
      },
    },
    regionDetails: {
      selector: '//div[@data-auto-id="regionDetailsContainer"]//div',
      locateStrategy: 'xpath',
      elements: {
        ukRegion: {
          selector: 'table/tbody/tr/td[1]',
          locateStrategy: 'xpath',
        },
      },
    },
  },
}
