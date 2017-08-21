const faker = require('faker')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Stages = client.page.InvestmentStages()
  const Contact = client.page.Contact()
  const Company = client.page.Company()
  const Investment = client.page.InvestmentProject()
  const foreignCompanyName = 'Lambda plc'
  let projectName
  let strategicdriver
  let possibleLocation
  let totalInvestmentValue
  let foreignEquityInvestmentValue
  let newJobsValue
  let averageSalary
  let safeguardedJobsValue
  let projectAssurance
  let projectManager

  Given(/^I am an authenticated Client relationship manager user on Data Hub website$/, async () => {
    await client.page.Login().navigate().authenticate()
  })

  When(/^I navigate to my Investment project$/, async () => {
    projectName = faker.commerce.productName()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Investment
      .clickInvestmentsTab()
      .createNewInvestmentProject(projectName)
  })

  When(/^I enter all required fields for Requirements section under Details tab$/, async () => {
    await Stages
      .click('@addRequirmentsButton')
      .click('@strategicDriver')
      .getText('@strategicDriverList', (result) => {
        strategicdriver = result.value
      })
      .click('@strategicDriverList')
      .click('@consideringOtherCountriesNo')
      .click('@possibleUkLocation')
      .getText('@possibleUkLocationList', (result) => {
        possibleLocation = result.value
      })
      .click('@possibleUkLocationList')
      .click('@ukLocationDeciededYes')
  })

  When(/^I click on Save button$/, async () => {
    await Stages
      .submitForm('form')
  })

  Then(/^I see the (.*) confirmation message$/, async (successMsg) => {
    await Company
      .assert.containsText('@flashInfo', successMsg)
  })

  Then(/^I see the Updated investment requirements confirmation message$/, async () => {
    await Company
      .assert.containsText('@flashInfo', 'Updated investment requirements')
  })

  Then(/^I verify that all fields are populated correctly for Requirements section$/, async () => {
    await Stages
      .verify.visible('@editRequirmentsButton')
      .verify.containsText('@strategicDriverFromProjectDetails', strategicdriver)
      .verify.containsText('@clientRequirementsFromProjectDetails', '')
      .verify.containsText('@competitorCountryFromProjectDetails', '')
      .verify.containsText('@possibleUkLocationFromProjectDetails', possibleLocation)
  })

  When(/^I enter all required fields for location section under Details tab$/, async () => {
    // to do for UK locations in next sprint.
  })

  Then(/^I verify that all fields are populated correctly for location section$/, async () => {
    // to do for UK locations in next sprint.
  })

  When(/^I enter all required fields for Value section under Details tab$/, async () => {
    totalInvestmentValue = faker.random.number({ min: 40000, max: 50000 })
    foreignEquityInvestmentValue = faker.random.number({ min: 30000, max: 40000 })
    newJobsValue = faker.random.number(100, 200)
    safeguardedJobsValue = faker.random.number(75, 100)
    await Stages
      .click('@addValueButton')
      .setValue('@totalInvestment', totalInvestmentValue)
      .setValue('@foreignEquityInvestment', foreignEquityInvestmentValue)
      .click('@financialAssistanceYes')
      .setValue('@newJobs', newJobsValue)
      .click('@averageSalary')
      .getText('@averageSalaryList', (result) => {
        averageSalary = result.value
      })
      .click('@averageSalaryList')
      .setValue('@safeguardedJobs', safeguardedJobsValue)
      .click('@budgetForRnDYes')
      .click('@nonFDIRnDYes')
      .click('@newTechToUKYes')
      .click('@exportRevenueYes')
  })

  Then(/^I verify that all fields are populated correctly for Value section$/, async () => {
    await Stages
      .verify.visible('@editValueButton')
      .getText('@totalInvestmentFromProjectDetails', (result) => {
        Stages.assert.equal(result.value.replace('£', '').replace(',', ''), totalInvestmentValue)
      })
      .getText('@foreignEquityInvestmentFromProjectDetails', (result) => {
        Stages.assert.equal(result.value.replace('£', '').replace(',', ''), foreignEquityInvestmentValue)
      })
      .getText('@financialAssistanceFromProjectDetails', (result) => {
        Stages.assert.equal(result.value, 'Has government assistance')
      })
      .getText('@newJobsFromProjectDetails', (result) => {
        Stages.assert.equal(result.value, `${newJobsValue} new jobs`)
      })
      .getText('@averageSalaryFromProjectDetails', (result) => {
        Stages.assert.equal(result.value, averageSalary)
      })
      .getText('@safeguardedJobsFromProjectDetails', (result) => {
        Stages.assert.equal(result.value, `${safeguardedJobsValue} safeguarded jobs`)
      })
      .getText('@budgetForRnDFromProjectDetails', (result) => {
        Stages.assert.equal(result.value, 'Has R&D budget')
      })
      .getText('@nonFDIRnDFromProjectDetails', (result) => {
        Stages.assert.equal(result.value, 'Has linked non-FDI R&D projects')
      })
      .getText('@newTechToUKFromProjectDetails', (result) => {
        Stages.assert.equal(result.value, 'Has new-to-world tech, business model or IP')
      })
      .getText('@exportRevenueFromProjectDetails', (result) => {
        Stages.assert.equal(result.value, 'Yes, will create significant export revenue')
      })
  })

  When(/^I set receiving government financial assistance option to NO$/, async () => {
    await Stages
    .click('@financialAssistanceNo')
  })

  Then(/^I verify that project is not receiving financial assistance under Value section$/, async () => {
    await Stages
      .getText('@financialAssistanceFromProjectDetails', (result) => {
        Stages.assert.equal(result.value, 'No government assistance')
      })
  })

  When(/^I set budget for a research and development option to NO$/, async () => {
    await Stages
    .click('@budgetForRnDNo')
  })

  Then(/^I verify that project has no budget for a research and development under Value section$/, async () => {
    await Stages
      .getText('@budgetForRnDFromProjectDetails', (result) => {
        Stages.assert.equal(result.value, 'No R&D budget')
      })
  })

  When(/^I set project associated with a non-FDI R&D project option to NO$/, async () => {
    await Stages
    .click('@nonFDIRnDNo')
  })

  Then(/^I verify that project has no association with a non-FDI R&D project under Value section$/, async () => {
    await Stages
      .getText('@nonFDIRnDFromProjectDetails', (result) => {
        Stages.assert.equal(result.value, 'No linked non-FDI R&D projects')
      })
  })

  When(/^I set new to world technology option to NO$/, async () => {
    await Stages
    .click('@newTechToUKNo')
  })

  Then(/^I verify that project has no new to world technology under Value section$/, async () => {
    await Stages
      .getText('@newTechToUKFromProjectDetails', (result) => {
        Stages.assert.equal(result.value, 'No new-to-world tech, business model or IP')
      })
  })

  When(/^I set export of their products and services option to NO$/, async () => {
    await Stages
    .click('@exportRevenueNo')
  })

  Then(/^I verify that project has no export of their products and services under Value section$/, async () => {
    await Stages
      .getText('@exportRevenueFromProjectDetails', (result) => {
        Stages.assert.equal(result.value, 'No, will not create significant export revenue')
      })
  })

  Then(/^I verify that Assign PM stage button is enabled$/, async () => {
    await Stages
      .verify.visible('@assignPMButton')
  })

  When(/^I click on Assign PM stage button$/, async () => {
    await Stages
      .click('@assignPMButton')
  })

  Then(/^I verify the stage of the project is updated from Prospect stage to Assign PM stage$/, async () => {
    await Stages
      .getText('@assignPMstage', (result) => {
        Contact.assert.equal(result.value, 'Assign PM stage')
      })
  })

  Then(/^I verify an Email is sent to Investment services team \(IST\)$/, async () => {
  })

  Then(/^I verify the project is in Ongoing state$/, async () => {
    await Stages
      .getText('@projectStateFromTop', (result) => {
        Contact.assert.equal(result.value, 'Ongoing')
      })
  })

  When(/^I change the state to (.*)$/, async (state) => {
    await Stages
      .click('@changeStateButton')
      .click('@changeState')
      .setValue('@changeStateList', state)
      .submitForm('form')
  })

  Then(/^I verify the project state is changed to (.*)$/, async (state) => {
    await Stages
      .getText('@projectStateFromTop', (result) => {
        Contact.assert.equal(result.value, state)
      })
  })

  Given(/^I am an authenticated Investment services team user on Data Hub website$/, async () => {
    await client.page.Login().navigate().authenticate()
  })

  When(/^I enter all required fields for Project Manager section under Project team tab$/, async () => {
    await Stages
      .click('@projectTeamTab')
      .click('@assignPMButton')
      .click('@projectManager')
      .getText('@projectManagerList', (result) => {
        projectManager = result.value
      })
      .click('@projectManagerList')
  })

  Then(/^I verify that all fields are populated correctly for Project Manager section$/, async () => {
    await Stages
      .verify.visible('@editPMButton')
      .assert.containsText('@projectManagerFromProjectTeamTab', projectManager.trim())
  })

  When(/^I enter all required fields for Project Assurance section under Project team tab$/, async () => {
    await Stages
      .click('@projectTeamTab')
      .click('@assignPMButton')
      .click('@projectAssuranceAdviser')
      .getText('@projectAssuranceAdviserList', (result) => {
        projectAssurance = result.value
      })
      .click('@projectAssuranceAdviserList')
  })

  Then(/^I verify that all fields are populated correctly for Project Assurance section$/, async () => {
    await Stages
      .verify.visible('@editPMButton')
      .getText('@projectAssuranceAdviserFromProjectTeamTab', (result) => {
        Stages.assert.contains(projectAssurance, result.value)
      })
  })

  Then(/^I verify that Active stage button is enabled under Project team tab$/, async () => {
  })

  When(/^I click on Active stage button$/, async () => {
  })

  Then(/^I verify the stage of the project is updated from Assign PM stage to Active stage$/, async () => {
  })

  Then(/^I verify an Email is sent to Allocated project manager$/, async () => {
  })

  Then(/^I verify an Email is sent to Allocated project assurance manager$/, async () => {
  })

  Given(/^I am an authenticated Allocated Project Manager user on Data Hub website$/, async () => {
  })

  When(/^I navigate to my Investment project within Active stage$/, async () => {
  })

  When(/^I enter actual landing date under Investment details tab$/, async () => {
  })

  When(/^I upload an Evidence under Investment details tab$/, async () => {
  })

  Then(/^I verify that all fields are populated correctly for Investment project summary section$/, async () => {
  })

  When(/^I enter Investment location under Investment details tab$/, async () => {
  })

  When(/^I enter UK Company under Investment details tab$/, async () => {
  })

  Then(/^I verify that all fields are populated correctly for Requirements and Location section$/, async () => {
  })

  Then(/^I upload an Evidence for Value section under Investment details tab$/, async () => {
  })

  Then(/^I verify that all evidences are populated correctly for Value section$/, async () => {
  })

  Then(/^I verify that Verify Win stage button is enabled under Investment details tab$/, async () => {
  })

  When(/^I click on Verify Win stage button$/, async () => {
  })

  Then(/^I verify the stage of the project is updated from Active stage to Verify Win stage$/, async () => {
  })

  Then(/^I verify an Email is sent to Allocation Team$/, async () => {
  })

  Given(/^I am an authenticated Verification Team user on Data Hub website$/, async () => {
  })

  When(/^I navigate to my Investment project within Verify Win stage$/, async () => {
  })

  When(/^I access all the sections to verify any pending information under Evaluation tab$/, async () => {
  })

  When(/^I update any pending information found under Evaluation tab$/, async () => {
  })

  Then(/^I verify that all fields are populated correctly under Evaluation tab$/, async () => {
  })

  Then(/^I verify that Won stage button is enabled under Evaluation tab$/, async () => {
  })

  When(/^I click on Won stage button$/, async () => {
  })

  Then(/^I verify the stage of the project is updated from Verify Win stage to Won stage$/, async () => {
  })

  When(/^I navigate to my Investment project within Won stage$/, async () => {
  })

  Then(/^I verify the project is in Won state$/, async () => {
  })
})
