const faker = require('faker')
const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')

defineSupportCode(({ Given, Then, When }) => {
  const Company = client.page.Company()
  const Contact = client.page.Contact()
  const Investment = client.page.InvestmentProject()
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
    await Investment
      .clickInvestmentsTab()
  })

  Then(/^I verify an option to add a new Investment project$/, async () => {
    await Investment
      .verify.visible('@addInvestmentProjectButton')
  })

  When(/^I create a new Investment project as a source of foreign equity investment$/, async () => {
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

  Then(/^I see the Investment project creation confirmation message$/, async () => {
    await Investment
      .getText('@projectNameFromSummaryPage', (result) => {
        Investment.assert.equal(result.value, projectName)
      })
      .getText('@projectSummaryTitle', (result) => {
        Investment.assert.equal(result.value, 'Investment project summary')
      })
  })

  Then(/^I verify my newly created Investment project in company profile$/, async () => {
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Investment
      .clickInvestmentsTab()
      .getText('@projectNameFromCompanyProfile', (result) => {
        Investment.assert.equal(result.value, projectName)
      })
  })

  Then(/^I verify Type of Investment is shown as "([^"]*)"$/, async (typeOfInvestment) => {
    await Investment
      .clickOnProjectNameFromCompanyProfile()
      .getText('@typeOfInvestmentFromProjectDetails', (result) => {
        Investment.assert.equal(result.value, typeOfInvestment)
      })
  })

  When(/^I create a new Investment project with a different client relation manager$/, async () => {
    projectName = faker.commerce.productName()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Investment
      .clickInvestmentsTab()
      .createNewInvestmentProjectWithDifferentClientRelationManager(projectName)
      .setValue('@clientRelationshipManager', 'a')
      .getText('@clientRelationshipManagerList', (result) => {
        actualName = result.value
      })
      .click('@clientRelationshipManagerList')
      .submitTheForm()
  })

  Then(/^I verify the client relation manager details shown under Project team$/, async () => {
    await Investment
      .clickOnProjectNameFromCompanyProfile()
      .clickOnProjectTeamTab()
      .getText('@clientRelationsshipManagementAdviserName', (result) => {
        Investment.assert.equal(result.value, actualName)
      })
  })

  When(/^I create a new Investment project with a different referral source adviser$/, async () => {
    projectName = faker.commerce.productName()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Investment
      .clickInvestmentsTab()
      .createNewInvestmentProjectWithDifferentReferralSourceAdviser(projectName)
      .setValue('@referralSourceAdviser', 'a')
      .getText('@referralSourceAdviserList', (result) => {
        actualName = result.value
      })
      .click('@referralSourceAdviserList')
      .submitTheForm()
  })

  Then(/^I verify the referral source adviser details shown under Project team$/, async () => {
    await Investment
      .clickOnProjectNameFromCompanyProfile()
      .clickOnProjectTeamTab()
      .getText('@referralSourceAdviserName', (result) => {
        Investment.assert.equal(result.value, actualName)
      })
  })

  When(/^I create a new Investment project with different client relation manager and referral source adviser$/, async () => {
    projectName = faker.commerce.productName()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Investment
      .clickInvestmentsTab()
      .createNewInvestmentProjectWithDifferentClientAndReferralDetails(projectName)
      .setValue('@clientRelationshipManager', 'a')
      .getText('@clientRelationshipManagerList', (result) => {
        actualName = result.value
      })
      .click('@clientRelationshipManagerList')
      .setValue('@referralSourceAdviser', 'a')
      .getText('@referralSourceAdviserList', (result) => {
        actualAdviserName = result.value
      })
      .click('@referralSourceAdviserList')
      .submitTheForm()
  })

  Then(/^I verify the client relation manager and referral source adviser details shown under Project team$/, async () => {
    await Investment
      .clickOnProjectNameFromCompanyProfile()
      .clickOnProjectTeamTab()
      .getText('@clientRelationsshipManagementAdviserName', (result) => {
        Investment.assert.equal(result.value, actualName)
      })
      .getText('@referralSourceAdviserName', (result) => {
        Investment.assert.equal(result.value, actualAdviserName)
      })
  })

  When(/^I create a new Investment project with FDI as Investment type$/, async () => {
    projectName = faker.commerce.productName()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Investment
      .clickInvestmentsTab()
      .createNewInvestmentProjectWithFDIasInvestmentType(projectName)
      .click('@typeOfFDI')
      .getText('@typeOfFDIList', (result) => {
        actualName = result.value
      })
      .click('@typeOfFDIList')
      .submitTheForm()
  })

  When(/^I create a new Investment project with Non-FDI as Investment type$/, async () => {
    projectName = faker.commerce.productName()
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Investment
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
    await Investment
      .clickInvestmentsTab()
      .clickAddInvestmentProjectButton()
      .enterSourceCompanySearch(foreignCompanyName)
      .submitForm('form')
      .clickOnCompanyFromList()
    await Investment
      .createNewInvestmentProjectAsNonForeignEquityInvestment(projectName)
  })

  Then(/^I verify my newly created foreign equity Investment project in company profile$/, async () => {
    await Company
      .navigate()
      .findCompany(foreignCompanyName)
    await Contact
      .clickOnFirstCompanyFromList()
    await Investment
      .clickInvestmentsTab()
      .getText('@projectNameFromCompanyProfile', (result) => {
        Investment.assert.equal(result.value, projectName)
      })
  })
})
