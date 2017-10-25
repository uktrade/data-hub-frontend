const faker = require('faker')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()
  const Contact = client.page.Contact()
  const InvestmentProject = client.page.InvestmentProject()
  const foreignCompanyName = 'Lambda plc'
  const ukLtdCompanyName = 'Venus ltd'
  let projectName
  let actualName
  let actualAdviserName

  When(/^I navigate to Investments page of any company$/, async () => {
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await InvestmentProject
      .clickInvestmentsTab()
  })

  Then(/^I verify an option to add a new Investment project$/, async () => {
    await InvestmentProject
      .assert.visible('@addInvestmentProjectButton')
  })

  When(/^I create a new Investment project as a source of foreign equity investment$/, async () => {
    projectName = faker.commerce.productName()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await InvestmentProject
      .clickInvestmentsTab()
      .createNewInvestmentProject(projectName)
  })

  Then(/^I verify my newly created Investment project in company profile$/, async () => {
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await InvestmentProject
      .clickInvestmentsTab()
      .getText('@projectNameFromCompanyProfile', (result) => {
        InvestmentProject.assert.equal(result.value, projectName)
      })
  })

  Then(/^I verify Type of Investment is shown as "([^"]*)"$/, async (typeOfInvestment) => {
    await InvestmentProject
      .clickOnProjectNameFromCompanyProfile()
      .getText('@typeOfInvestmentFromProjectDetails', (result) => {
        InvestmentProject.assert.equal(result.value, typeOfInvestment)
      })
  })

  When(/^I create a new Investment project with a different client relation manager$/, async () => {
    projectName = faker.commerce.productName()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await InvestmentProject
      .clickInvestmentsTab()
      .createNewInvestmentProjectWithDifferentClientRelationManager(projectName)
      .click('@clientRelationshipManager')
      .getText('@clientRelationshipManagerList', (result) => {
        actualName = result.value
      })
      .click('@clientRelationshipManagerList')
      .submitTheForm()
  })

  Then(/^I verify the client relation manager details shown under Project team$/, async () => {
    await InvestmentProject
      .clickOnProjectNameFromCompanyProfile()
      .clickOnProjectTeamTab()
      .getText('@clientRelationsshipManagementAdviserName', (result) => {
        InvestmentProject.assert.equal(result.value, actualName.trim())
      })
  })

  When(/^I create a new Investment project with a different referral source adviser$/, async () => {
    projectName = faker.commerce.productName()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await InvestmentProject
      .clickInvestmentsTab()
      .createNewInvestmentProjectWithDifferentReferralSourceAdviser(projectName)
      .click('@referralSourceAdviser')
      .getText('@referralSourceAdviserList', (result) => {
        actualName = result.value
      })
      .click('@referralSourceAdviserList')
      .submitTheForm()
  })

  Then(/^I verify the referral source adviser details shown under Project team$/, async () => {
    await InvestmentProject
      .clickOnProjectNameFromCompanyProfile()
      .clickOnProjectTeamTab()
      .getText('@referralSourceAdviserName', (result) => {
        InvestmentProject.assert.equal(result.value, actualName.trim())
      })
  })

  When(/^I create a new Investment project with different client relation manager and referral source adviser$/, async () => {
    projectName = faker.commerce.productName()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await InvestmentProject
      .clickInvestmentsTab()
      .createNewInvestmentProjectWithDifferentClientAndReferralDetails(projectName)
      .click('@clientRelationshipManager')
      .getText('@clientRelationshipManagerList', (result) => {
        actualName = result.value
      })
      .click('@clientRelationshipManagerList')
      .click('@referralSourceAdviser')
      .getText('@referralSourceAdviserList', (result) => {
        actualAdviserName = result.value
      })
      .click('@referralSourceAdviserList')
      .submitTheForm()
  })

  Then(/^I verify the client relation manager and referral source adviser details shown under Project team$/, async () => {
    await InvestmentProject
      .clickOnProjectNameFromCompanyProfile()
      .clickOnProjectTeamTab()
      .getText('@clientRelationsshipManagementAdviserName', (result) => {
        InvestmentProject.assert.equal(result.value, actualName.trim())
      })
      .getText('@referralSourceAdviserName', (result) => {
        InvestmentProject.assert.equal(result.value, actualAdviserName.trim())
      })
  })

  When(/^I create a new Investment project with FDI as Investment type$/, async () => {
    projectName = faker.commerce.productName()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await InvestmentProject
      .clickInvestmentsTab()
      .createNewInvestmentProjectWithFDIasInvestmentType(projectName)
      .submitTheForm()
  })

  When(/^I create a new Investment project with Non-FDI as Investment type$/, async () => {
    projectName = faker.commerce.productName()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await InvestmentProject
      .clickInvestmentsTab()
      .createNewInvestmentProjectWithNonFDIasInvestmentType(projectName)
      .submitTheForm()
  })

  When(/^I create a new Investment project as not a source of foreign equity investment$/, async () => {
    projectName = faker.commerce.productName()
    await Company
      .navigate()
      .findCompany(ukLtdCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await InvestmentProject
      .clickInvestmentsTab()
      .clickAddInvestmentProjectButton()
      .enterSourceCompanySearch(foreignCompanyName)
      .submitForm('form')
      .clickOnCompanyFromList()
    await InvestmentProject
      .createNewInvestmentProjectAsNonForeignEquityInvestment(projectName)
  })

  Then(/^I verify my newly created foreign equity Investment project in company profile$/, async () => {
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await InvestmentProject
      .clickInvestmentsTab()
      .getText('@projectNameFromCompanyProfile', (result) => {
        InvestmentProject.assert.equal(result.value, projectName)
      })
  })

  When(/^I search for my newly created Investment project$/, async () => {
    await Company
      .navigate()
      .findCompany(projectName)
  })

  Then(/^I verify it is displayed in the search results$/, async () => {
    await InvestmentProject
      .clickOnInvestmentProjectsTabUnderSearch()
      .getText('@projectNameFromCompanyProfile', (result) => {
        InvestmentProject.assert.equal(result.value, projectName)
      })
  })
})
