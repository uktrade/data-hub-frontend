const { get, set, lowerCase, assign, find } = require('lodash')
const { client } = require('nightwatch-cucumber')
const { When } = require('cucumber')

const { company: companyFixtures } = require('../../setup/fixtures')
const { getDateFor } = require('../../../helpers/date')

const InvestmentProject = client.page.investments.Project()
const Location = client.page.Location()

When(/^I select (.+) as the Investment project type$/, async function (investmentType) {
  if (lowerCase(investmentType) === 'fdi') {
    await InvestmentProject
      .selectFdiTypeOfInvestmentProject({
        type: 'FDI',
      }, (investmentProject) => {
        set(this.state, 'investmentProject', assign({}, get(this.state, 'investmentProject'), investmentProject))
      })
  } else {
    await InvestmentProject
      .selectNonFdiTypeOfInvestmentProject()

    set(this.state, 'investmentProject.type', 'Non-FDI')
  }
})

When(/^I choose (.+) for "Will this company be the source of foreign equity investment\?"$/, async function (choice) {
  if (lowerCase(choice) === 'yes') {
    set(this.state, 'investmentProject.equitySource.name', get(this.state, 'company.name'))
  }

  await InvestmentProject
    .setEquitySource(choice)
})

When(/^I populate the create Investment Project form$/, async function () {
  await InvestmentProject
    .section.projectForm
    .assert.visible('@name')
    .assert.visible('@description')
    .assert.visible('@anonymousDescription')
    .assert.visible('@primarySector')
    .assert.visible('@businessActivity')
    .assert.visible('@otherBusinessActivity')
    .assert.visible('@clientRelationshipManagerYes')
    .assert.visible('@clientRelationshipManagerNo')
    .assert.visible('@referralSourceYes')
    .assert.visible('@referralSourceNo')
    .assert.visible('@estimatedLandDateYear')
    .assert.visible('@estimatedLandDateMonth')
    .assert.visible('@actualLandDateYear')
    .assert.visible('@actualLandDateMonth')
    .assert.visible('@actualLandDateDay')
    .assert.visible('@investorType')
    .assert.visible('@levelOfInvolvement')
    .assert.visible('@specificInvestmentProgramme')
    .assert.visible('@clientContact')
    .assert.visible('@saveButton')

  await InvestmentProject
    .populateForm((investmentProject) => {
      set(this.state, 'investmentProject', assign({}, get(this.state, 'investmentProject'), investmentProject))
      set(this.state, 'investmentProject.heading', investmentProject.name)
      set(this.state, 'investmentProject.estimatedLandDate', getDateFor({
        year: this.state.investmentProject.estimatedLandDateYear,
        month: this.state.investmentProject.estimatedLandDateMonth,
        day: 1,
      }, 'MMMM YYYY'))

      set(this.state, 'investmentProject.actualLandDate', getDateFor({
        year: this.state.investmentProject.actualLandDateYear,
        month: this.state.investmentProject.actualLandDateMonth,
        day: this.state.investmentProject.actualLandDateDay,
      }))

      const { businessActivity, otherBusinessActivity } = this.state.investmentProject
      set(this.state, 'investmentProject.businessActivities', `${businessActivity}, ${otherBusinessActivity}`)
    })
})

When(/^I navigate to the Investment Projects source of equity investment$/, async function () {
  const equitySource = get(this.state, 'investmentProject.equitySource.name')
  const projectSummarySection = InvestmentProject.section.projectDetails.section.summary

  await projectSummarySection
    .assert.containsText('@header', 'Investment project summary')
    .assert.containsText('@clientLink', equitySource)
    .waitForElementPresent('@header')

  await InvestmentProject
    .storeProjectDetails((projectDetails) => {
      set(this.state, 'investmentProject', assign({}, projectDetails, get(this.state, 'investmentProject')))
    })

  await projectSummarySection
    .click('@clientLink')

  await InvestmentProject
    .section.localHeader
    .waitForElementPresent('@header')
    .assert.containsText('@header', equitySource)

  await Location
    .section.localNav
    .waitForElementPresent('@investment')
    .click('@investment')
})

When(/^I search for the foreign source of equity (.+)$/, async function (companyName) {
  const sourceOfForeignEquity = find(companyFixtures, { name: companyName })

  await InvestmentProject
    .searchForEquitySourceCompany(sourceOfForeignEquity.name)

  set(this.state, 'investmentProject.equitySource', {
    name: sourceOfForeignEquity.name,
    heading: sourceOfForeignEquity.name,
    address: `${sourceOfForeignEquity.address1}, ${sourceOfForeignEquity.town}, ${sourceOfForeignEquity.postcode}`,
    country: sourceOfForeignEquity.country,
  })
  set(this.state, 'equitySource.heading', sourceOfForeignEquity.name)
})
