const { get, set, lowerCase, assign, find } = require('lodash')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

const { getDateFor } = require('../../../helpers/date')

defineSupportCode(({ Given, Then, When }) => {
  const Search = client.page.Search()
  const Company = client.page.Company()
  const InvestmentProject = client.page.InvestmentProject()

  Given(/^I navigate to the Investment Projects page for (.+)$/, async function (companyName) {
    set(this.state, 'investmentProject.company.name', companyName)

    await Search
      .navigate()
      .search(companyName)
      .section.firstCompanySearchResult
      .waitForElementPresent('@header')
      .click('@header')

    await Company
      .section.localHeader
      .waitForElementPresent('@header')
      .assert.containsText('@header', companyName)

    await InvestmentProject
      .section.detailsTabs
      .waitForElementPresent('@investment')
      .click('@investment')
  })

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
      set(this.state, 'investmentProject.equitySource.name', get(this.state, 'investmentProject.company.name'))
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
      })
  })

  Then(/^Investment project summary has all of the entered information$/, async function () {
    const projectDetailsSection = InvestmentProject.section.projectDetails.section.summary

    await projectDetailsSection
      .waitForElementPresent('@header')
      .assert.containsText('@header', 'Investment project summary')
      .assert.visible('@clientLink')
      .assert.containsText('@clientLink', get(this.state, 'investmentProject.equitySource.name'))
      .assert.visible('@typeOfInvestment')
      .assert.containsText('@typeOfInvestment', get(this.state, 'investmentProject.type'))
      .assert.visible('@primarySector')
      .assert.containsText('@primarySector', get(this.state, 'investmentProject.primarySector'))
      .assert.visible('@businessActivity')
      .assert.containsText('@businessActivity', get(this.state, 'investmentProject.businessActivity'))
      .assert.visible('@clientContact')
      // contact in investmentProjects create form has ', job_title` appended, this split removes that to run this check
      .assert.containsText('@clientContact', get(this.state, 'investmentProject.clientContact').split(',')[0])
      .assert.visible('@projectDescription')
      .assert.containsText('@projectDescription', get(this.state, 'investmentProject.description'))
      .assert.visible('@anonDescription')
      .assert.containsText('@anonDescription', get(this.state, 'investmentProject.anonymousDescription'))
      .assert.visible('@estimatedLandDate')
      .assert.containsText('@estimatedLandDate', get(this.state, 'investmentProject.estimatedLandDate'))
      .assert.visible('@levelOfInvolvement')
      .assert.containsText('@levelOfInvolvement', get(this.state, 'investmentProject.levelOfInvolvement'))
      .assert.visible('@specificInvestmentProgramme')
      .assert.containsText('@specificInvestmentProgramme', get(this.state, 'investmentProject.specificInvestmentProgramme'))
      .assert.visible('@newOrExistingInvestor')
      .assert.containsText('@newOrExistingInvestor', get(this.state, 'investmentProject.investorType'))
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

    await InvestmentProject
      .section.detailsTabs
      .waitForElementPresent('@investment')
      .click('@investment')
  })

  When(/^I search for the foreign source of equity (.+)$/, async function (companyName) {
    const sourceOfForeignEquity = find(this.fixtures.company, ['name', companyName])

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
})
