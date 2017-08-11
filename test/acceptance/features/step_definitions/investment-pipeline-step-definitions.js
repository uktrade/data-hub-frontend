const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Then, When }) => {
  const Company = client.page.Company()
  const InvestmentPipeline = client.page.InvestmentPipeline()
  let projectName
  let actualName

  When(/^I navigate to Investment projects pipeline$/, async () => {
    await Company
      .navigate()
    await InvestmentPipeline
      .click('@viewYourProjectPipelineLink')
  })

  Then(/^I see display containing Project name, Value, Stage, Likelihood of landing, Land date$/, async () => {
    await InvestmentPipeline
      .verifyProjectHeaders()
  })

  Then(/^I see Project value, Number of jobs, Primary sector, Sub-sector filters displayed to the user$/, async () => {
    await InvestmentPipeline
      .verifyProjectFilters1()
  })

  Then(/^I see Advisor team name, Type of Investment, start date, end date and stage filters displayed to the user$/, async () => {
    await InvestmentPipeline
      .verifyProjectFilters2()
  })

  When(/^I filter the display by Investment project stage (.*)$/, async (stage) => {
    await InvestmentPipeline
      .click('@removeSingleFilters')
      .click('@projectLandingDateFromList')
      .selectProjectStage(stage)
  })

  Then(/^I verify the display is changed based on the given project stage (.*)$/, async (stage) => {
    await InvestmentPipeline
      .click('@projectLandingDateFromList')
      .assert.containsText('@projectStageFromFirstList', stage)
  })

  When(/^I filter the display by project type (.*)$/, async (type) => {
    await InvestmentPipeline
      .click('@removeSingleFilters')
      .click('@projectLandingDateFromList')
      .selectInvestmentType(type)
  })

  Then(/^I verify the display is changed based on the given project type (.*)$/, async (type) => {
    await InvestmentPipeline
      .click('@projectLandingDateFromList')
      .verify.containsText('@projectTypeFromFirstList', type)
  })

  When(/^I filter the display by sector$/, async () => {
    await InvestmentPipeline
      .click('@removeAllFilters')
      .click('@sectorFilter')
      .getText('@sectorFilterAdvancedEngineering', (result) => {
        actualName = result.value
      })
      .click('@sectorFilterAdvancedEngineering')
  })

  Then(/^I verify the display is changed based on the given sector$/, async () => {
    await InvestmentPipeline
      .assert.containsText('@sectorFromList', actualName.trim())
  })

  When(/^I filter the display by date range$/, async () => {
    await InvestmentPipeline
      .click('@removeAllFilters')
      .setValue('@datesFromFilter', 'November 1, 2020')
      .setValue('@datesToFilter', 'November 1, 2020')
      .click('@projectLandingDateFromList')
  })

  Then(/^I verify the display is changed based on the given date range$/, async () => {
    await InvestmentPipeline
      .click('@projectLandingDateFromList')
      .assert.containsText('@projectLandingDateFromList', '1 November 2020')
  })

  When(/^I sort the display by Stage$/, async () => {
    await InvestmentPipeline
      .click('@removeAllFilters')
      .click('@sortByDropDown')
      .click('@sortByStage')
  })

  Then(/^I verify the display is sorted by stage$/, async () => {
    await InvestmentPipeline
      .click('@projectLandingDateFromList')
      .assert.containsText('@projectStage', 'Active')
  })

  When(/^I click on a Project name$/, async () => {
    await InvestmentPipeline
      .getText('@projectNameFromList', (result) => {
        projectName = result.value
      })
      .click('@projectNameFromList')
  })

  Then(/^I verify user navigating to the Project details page$/, async () => {
    await InvestmentPipeline
      .assert.containsText('@projectNameFromDetails', projectName)
  })
})
