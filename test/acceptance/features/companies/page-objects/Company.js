const faker = require('faker')
const { assign } = require('lodash')

const {
  getMetaListItemValueSelector,
  getButtonWithText,
  getDetailsTableRowValue,
  getSelectorForElementWithText,
} = require('../../../helpers/selectors')
const { appendUid, getUid } = require('../../../helpers/uuid')
const { getAddress } = require('../../../helpers/address')

const getSelectorForDetailsSectionEditButton = (sectionTitle, buttonText = 'Edit') => {
  return getSelectorForElementWithText(sectionTitle, {
    el: '//h2',
    child: '/following-sibling::p[1]/a[contains(.,"Edit")]',
  })
}

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
    accountManagementEditButton: getSelectorForDetailsSectionEditButton('Account management'),
    exportsEditButton: getSelectorForDetailsSectionEditButton('Exports'),
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

            this.api.page.Location().section.localHeader
              .waitForElementPresent('@header')

            this
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
                  uniqueSearchTerm: getUid(company.name),
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
                  companyStep1.businessType = businessType
                  this.setValue(`@otherTypeOfUKOrganisationBusinessType`, businessType)
                  done()
                })
              })

            // step 2
            this
              .waitForElementPresent('@continueButton')
              .click('@continueButton')

            this.api.page.Location().section.localHeader
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
                  .page.Address()
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
                    }))

                    done()
                  })
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
              .waitForElementPresent('@parentCompanySearch')
              .setValue('@parentCompanySearch', parentCompany.name)
              .submitForm('form')

            // step 3
            this.section.firstCompanySearchResult
              .waitForElementPresent('@header')
              .click('@header')

            // step 4
            this.api.page.Location().section.localHeader
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

                callback(assign({}, company, {
                  header: company.name,
                  primaryAddress: getAddress(parentCompany),
                  uniqueSearchTerm: getUid(company.tradingName),
                }))
              })
          })
      },

      searchForCompanyInCollection (companyName) {
        this.api.url(`${process.env.QA_HOST}/companies`)
        return this
          .waitForElementPresent('@collectionsCompanyNameInput')
          .setValue('@collectionsCompanyNameInput', [companyName, this.api.Keys.ENTER]) // press enter
          .waitForElementNotVisible('@xhrTargetElement') // wait for xhr results to come back
          .waitForElementVisible('@xhrTargetElement')
      },

      updateAccountManagement (callback) {
        const accountManagement = {}

        this
          .waitForElementPresent('@accountManagementEditButton')
          .click('@accountManagementEditButton')

        this
          .section.accountManagementForm
          .waitForElementPresent('@oneListAccountOwner')
          .api.perform((done) => {
            this
              .section.accountManagementForm
              .getListOption('@oneListAccountOwner', (oneListAccountOwner) => {
                accountManagement.oneListAccountOwner = oneListAccountOwner
                done()
              })
          })
          .perform(() => {
            for (const key in accountManagement) {
              if (accountManagement[key]) {
                this
                  .section.accountManagementForm
                  .setValue(`@${key}`, accountManagement[key])
              }
            }
          })
          .perform(() => {
            this
              .section.accountManagementForm
              .waitForElementPresent('@saveButton')
              .click('@saveButton')

            callback(accountManagement)
          })
      },

      updateExports (callback) {
        const exports = {}

        this
          .waitForElementPresent('@exportsEditButton')
          .click('@exportsEditButton')

        this
          .section.exportsForm
          .waitForElementPresent('@exportWinCategory')
          .api.perform((done) => {
            this
              .section.exportsForm
              .getListOption('@exportWinCategory', (exportWinCategory) => {
                exports.exportWinCategory = exportWinCategory
                done()
              })
          })
          .perform(() => {
            for (const key in exports) {
              if (exports[key]) {
                this
                  .section.exportsForm
                  .setValue(`@${key}`, exports[key])
              }
            }
          })
          .perform(() => {
            this
              .section.exportsForm
              .waitForElementPresent('@saveButton')
              .click('@saveButton')

            callback(exports)
          })
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
        updated: getMetaListItemValueSelector('Updated'),
      },
    },
    companyDetails: {
      selector: '.table--key-value',
      elements: {
        ukRegion: getDetailsTableRowValue('UK region'),
      },
    },
    accountManagementForm: {
      selector: 'form',
      elements: {
        oneListAccountOwner: '#field-one_list_account_owner',
        saveButton: getButtonWithText('Save'),
      },
    },
    exportsForm: {
      selector: 'form',
      elements: {
        exportWinCategory: '#field-export_experience_category',
        saveButton: getButtonWithText('Update'),
      },
    },
  },
}
