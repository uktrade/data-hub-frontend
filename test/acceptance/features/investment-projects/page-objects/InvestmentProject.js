const { getYear, addYears } = require('date-fns')
const { set, lowerCase, forEach } = require('lodash')
const faker = require('faker')

const {
  getButtonWithText,
  getSelectorForElementWithText,
  getDetailsTableRowValue,
} = require('../../../helpers/selectors')
const {
  storeSelectValue,
  storeSelectSubFieldValues,
  storeRadioSubFieldValues,
} = require('../../../helpers/state')

const getHeaderSelector = (text) => getSelectorForElementWithText(text, {
  el: '//h2',
  className: 'heading-medium',
})

const getTableCellAnchorByName = (text) => getSelectorForElementWithText(text, {
  el: '//th',
  child: '/following-sibling::td/a',
})

const getHeaderMetaValueByName = (text) => getSelectorForElementWithText(text, {
  el: '//header//span',
  className: 'c-meta-list__item-label',
  child: '/following-sibling::span',
})

module.exports = {
  url: process.env.QA_HOST,
  commands: [
    {
      storeProjectDetails (callback) {
        const projectDetails = {}

        return this.section.localHeader
          .getText('@stage', (stage) => {
            set(projectDetails, 'stage', stage.value)
          })
          .getText('@status', (status) => {
            set(projectDetails, 'status', status.value)
          })
          .getText('@valuation', (valuation) => {
            set(projectDetails, 'valuation', valuation.value)
          })
          .getText('@projectCode', (projectCode) => {
            set(projectDetails, 'projectCode', projectCode.value)
            callback(projectDetails)
          })
      },
      selectFdiTypeOfInvestmentProject (projectDetails = {}, callback) {
        const typeOfInvestment = this.section.typeOfInvestment

        return typeOfInvestment
          .waitForElementPresent('@fdi')
          .click('@fdi')
          .api.perform((done) => {
            typeOfInvestment.getListOption('@fdiType', (subType) => {
              typeOfInvestment.setValue('@fdiType', subType)
              set(projectDetails, 'subType', subType)
              callback(projectDetails)
              done()
            })
          })
          .submitForm('form')
      },
      selectNonFdiTypeOfInvestmentProject () {
        this
          .section.typeOfInvestment
          .waitForElementPresent('@nonFdi')
          .click('@nonFdi')
          .submitForm('form')
      },
      populateForm (callback) {
        const nextYear = getYear(addYears(Date.now(), 1))
        const projectForm = this.section.projectForm
        const promises = []
        const project = {
          name: faker.company.companyName(),
          description: faker.lorem.sentence(),
          anonymousDescription: faker.lorem.sentence(),
          primarySector: 'select',
          businessActivity: 'select',
          otherBusinessActivity: faker.lorem.word(),
          estimatedLandDateYear: faker.random.number({ min: nextYear, max: nextYear + 40 }),
          estimatedLandDateMonth: faker.random.number({ min: 1, max: 12 }),
          investorType: 'select',
          levelOfInvolvement: 'select',
          specificInvestmentProgramme: 'select',
          clientContact: 'select',
          clientRelationshipManager: {
            inputType: 'radio',
            options: [
              'clientRelationshipManagerYes',
              'clientRelationshipManagerNo',
            ],
            values: {
              clientRelationshipManagerNo: {
                inputType: 'select',
              },
            },
          },
          referralSource: {
            inputType: 'radio',
            options: [
              'referralSourceYes',
              'referralSourceNo',
            ],
            values: {
              referralSourceNo: {
                inputType: 'select',
              },
            },
          },
          referralSourceActivity: {
            inputType: 'select',
            values: {
              referralSourceActivityMarketing: {
                inputType: 'select',
                value: 'marketing',
              },
              referralSourceActivityEvent: {
                inputType: 'text',
                value: 'event',
              },
              referralSourceActivityWebsite: {
                inputType: 'select',
                value: 'website',
              },
            },
          },
        }

        return this
          .api.perform((done) => {
            forEach(project, (value, key) => {
              if (value.inputType === 'radio') {
                promises.push(storeRadioSubFieldValues(project, key, value, projectForm))
              }

              if (value.inputType === 'select') {
                promises.push(storeSelectSubFieldValues(project, key, value, projectForm))
              }

              if (value === 'select') {
                promises.push(storeSelectValue(project, key, projectForm))
              }
            })

            Promise.all(promises)
              .then(() => {
                forEach(project, (value, key) => {
                  projectForm.setValue(`@${key}`, value)
                })
                done()
              })
          })
          .submitForm('form', () => {
            callback(project)
          })
      },
      setEquitySource (choice) {
        return this
          .section.equitySource
          .waitForElementPresent('@yes')
          .waitForElementPresent('@no')
          .click(`@${lowerCase(choice)}`)
          .submitForm('form')
      },
      searchForEquitySourceCompany (sourceOfForeignEquity) {
        return this.section.equitySource
          .waitForElementPresent('@searchInput')
          .setValue('@searchInput', sourceOfForeignEquity)
          .submitForm('@searchForm')
      },
    },
  ],
  sections: {
    typeOfInvestment: {
      selector: '#group-field-investment_type',
      elements: {
        fdi: 'label[for=field-investment_type-1]',
        fdiType: '#field-fdi_type',
        nonFdi: 'label[for=field-investment_type-2]',
      },
    },
    equitySource: {
      selector: '.main-content__inner',
      elements: {
        yes: 'label[for=field-is_equity_source-1]',
        no: 'label[for=field-is_equity_source-2]',
        searchInput: '#field-term',
        searchForm: '.c-entity-search',
      },
    },
    projectForm: {
      selector: 'form',
      elements: {
        name: '#field-name',
        description: '#field-description',
        anonymousDescription: '#field-anonymous_description',
        primarySector: '#field-sector',
        businessActivity: '#field-business_activities',
        otherBusinessActivity: '#field-other_business_activity',
        clientRelationshipManager: '#field-client_relationship_manager',
        clientRelationshipManagerYes: 'label[for=field-is_relationship_manager-1]',
        clientRelationshipManagerNo: 'label[for=field-is_relationship_manager-2]',
        referralSource: '#field-referral_source_adviser',
        referralSourceYes: 'label[for=field-is_referral_source-1]',
        referralSourceNo: 'label[for=field-is_referral_source-1]',
        referralSourceActivity: '#field-referral_source_activity',
        referralSourceActivityEvent: '#field-referral_source_activity_event',
        referralSourceActivityMarketing: '#field-referral_source_activity_marketing',
        referralSourceActivityWebsite: '#field-referral_source_activity_website',
        estimatedLandDateYear: '#field-estimated_land_date_year',
        estimatedLandDateMonth: '#field-estimated_land_date_month',
        investorType: '#field-investor_type',
        levelOfInvolvement: '#field-level_of_involvement',
        specificInvestmentProgramme: '#field-specific_programme',
        clientContact: '#field-client_contacts',
        saveButton: getButtonWithText('Save'),
      },
    },
    localHeader: { // TODO move this work to Location feature
      selector: '.c-local-header',
      elements: {
        header: '.c-local-header__heading',
        clientCompany: '.c-local-header__heading-before > a',
        status: getHeaderMetaValueByName('Status'),
        projectCode: getHeaderMetaValueByName('Project code'),
        valuation: getHeaderMetaValueByName('Valuation'),
        stage: {
          selector: '//ol[contains(@class,"c-progress-bar")]/li[contains(@class,"is-active")]/span',
          locateStrategy: 'xpath',
        },
      },
    },
    projectDetails: {
      selector: '.main-content__inner',
      sections: {
        summary: {
          selector: '.column-three-quarters',
          elements: {
            header: getHeaderSelector('Investment project summary'),
            clientLink: getTableCellAnchorByName('Client'),
            typeOfInvestment: getDetailsTableRowValue('Type of investment'),
            primarySector: getDetailsTableRowValue('Primary sector'),
            businessActivity: getDetailsTableRowValue('Business activity'),
            clientContact: getDetailsTableRowValue('Client contacts'),
            projectDescription: getDetailsTableRowValue('Project description'),
            anonDescription: getDetailsTableRowValue('Anonymised description'),
            estimatedLandDate: getDetailsTableRowValue('Estimated land date'),
            newOrExistingInvestor: getDetailsTableRowValue('New or existing investor'),
            levelOfInvolvement: getDetailsTableRowValue('Level of involvement'),
            specificInvestmentProgramme: getDetailsTableRowValue('Specific investment programme'),
          },
        },
      },
    },
  },
}
