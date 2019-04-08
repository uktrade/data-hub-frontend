@investment-projects-create
Feature: Create a new Investment project
  As an existing user
  I would like to create a new Investment project

  @investment-projects-create--verify-add
  Scenario: Verify Add Investment project option

    When I navigate to the `companies.investments` page using `company` `Lambda plc` fixture
    And I click the "Add investment project" link
    Then I am taken to the "Add investment project" page

  @investment-projects-create--fdi
  Scenario: Add a Foreign Direct Investment (FDI) Investment project

    When I navigate to the `companies.investments` page using `company` `Lambda plc` fixture
    And I click the "Add investment project" link
    Then I am taken to the "Add investment project" page
    And the Client company values are displayed
      | value                            |
      | Lambda plc                       |
      | France                           |
      | No investment projects in the UK |
    When I select FDI as the Investment project type
    And I choose Yes for "Will this company be the source of foreign equity investment?"
    And I populate the create Investment Project form
    Then I see the success message
    And the investment project local header is displayed
      | key           | value            | formatter              |
      | Status        | Ongoing - change |                        |
      | Project code  |                  | isProjectCodeFormatter |
      | Valuation     | Not yet valued   |                        |
      | Created on    |                  | isRecentDateFormatter  |
    And the Investment project summary key value details are displayed
      | key                           | value                                         |
      | Client                        | investmentProject.equitySource.name           |
      | Type of investment            | investmentProject.typeAndSubType              |
      | Primary sector                | investmentProject.primarySector               |
      | Business activity             | investmentProject.businessActivities          |
      | Client contacts               | investmentProject.clientContact               |
      | Project description           | investmentProject.description                 |
      | Anonymised description        | investmentProject.anonymousDescription        |
      | Estimated land date           | investmentProject.estimatedLandDate           |
      | Actual land date              | investmentProject.actualLandDate              |
      | New or existing investor      | investmentProject.investorType                |
      | Level of involvement          | investmentProject.levelOfInvolvement          |
      | Specific investment programme | investmentProject.specificInvestmentProgramme |

  @investment-projects-create--fdi-different-source-of-equity
  Scenario: Add a Foreign Direct Investment (FDI) Investment project with a separate company as the source of foreign equity

    When I navigate to the `companies.investments` page using `company` `Lambda plc` fixture
    And I click the "Add investment project" link
    Then I am taken to the "Add investment project" page
    And the Client company values are displayed
      | value                            |
      | Lambda plc                       |
      | France                           |
      | No investment projects in the UK |
    When I select FDI as the Investment project type
    And I choose No for "Will this company be the source of foreign equity investment?"
    And I search for the foreign source of equity Mars Exports Ltd
    Then I can view the Equity Source in the collection
      | text               | expected                               |
      | Primary address    | investmentProject.equitySource.address |
    And the Equity Source has badges
      | text               | expected                               |
      | Country            | investmentProject.equitySource.country |
    Then I choose the first item in the collection
    When I populate the create Investment Project form
    Then I see the success message
    And the investment project local header is displayed
      | key           | value            | formatter              |
      | Status        | Ongoing - change |                        |
      | Project code  |                  | isProjectCodeFormatter |
      | Valuation     | Not yet valued   |                        |
      | Created on    |                  | isRecentDateFormatter  |
    And the Investment project summary key value details are displayed
      | key                           | value                                         |
      | Client                        | investmentProject.equitySource.name           |
      | Type of investment            | investmentProject.typeAndSubType              |
      | Primary sector                | investmentProject.primarySector               |
      | Business activity             | investmentProject.businessActivities          |
      | Client contacts               | investmentProject.clientContact               |
      | Project description           | investmentProject.description                 |
      | Anonymised description        | investmentProject.anonymousDescription        |
      | Estimated land date           | investmentProject.estimatedLandDate           |
      | Actual land date              | investmentProject.actualLandDate              |
      | New or existing investor      | investmentProject.investorType                |
      | Level of involvement          | investmentProject.levelOfInvolvement          |
      | Specific investment programme | investmentProject.specificInvestmentProgramme |

  @investment-projects-create--non-fdi
  Scenario: Add a Non Foreign Direct Investment (Non-FDI) Investment project

    When I navigate to the `companies.investments` page using `company` `Venus Ltd` fixture
    And I click the "Add investment project" link
    Then I am taken to the "Add investment project" page
    And the Client company values are displayed
      | value                               |
      | Venus Ltd                           |
      | United Kingdom                      |
      | No investment projects in the UK    |
      | Tier A - Strategic Account          |
      | Relationship manager: Travis Greene |
    When I select Non-FDI as the Investment project type
    And I search for the foreign source of equity Lambda plc
    Then I can view the Equity Source in the collection
      | text               | expected                               |
      | Primary address    | investmentProject.equitySource.address |
    And the Equity Source has badges
      | text               | expected                               |
      | Country            | investmentProject.equitySource.country |
    Then I choose the first item in the collection
    When I populate the create Investment Project form
    Then I see the success message
    And the investment project local header is displayed
      | key           | value            | formatter              |
      | Status        | Ongoing - change |                        |
      | Project code  |                  | isProjectCodeFormatter |
      | Valuation     | Not yet valued   |                        |
      | Created on    |                  | isRecentDateFormatter  |
    And the Investment project summary key value details are displayed
      | key                           | value                                         |
      | Client                        | investmentProject.equitySource.name           |
      | Type of investment            | investmentProject.type                        |
      | Primary sector                | investmentProject.primarySector               |
      | Business activity             | investmentProject.businessActivities          |
      | Client contacts               | investmentProject.clientContact               |
      | Project description           | investmentProject.description                 |
      | Anonymised description        | investmentProject.anonymousDescription        |
      | Estimated land date           | investmentProject.estimatedLandDate           |
      | Actual land date              | investmentProject.actualLandDate              |
      | New or existing investor      | investmentProject.investorType                |
      | Level of involvement          | investmentProject.levelOfInvolvement          |
      | Specific investment programme | investmentProject.specificInvestmentProgramme |

  @investment-projects-create--cti
  Scenario: Add a Commitment to Invest Investment project

    When I navigate to the `companies.investments` page using `company` `Lambda plc` fixture
    And I click the "Add investment project" link
    Then I am taken to the "Add investment project" page
    And the Client company values are displayed
      | value                            |
      | Lambda plc                       |
      | France                           |
      | No investment projects in the UK |
    When I select Commitment to invest as the Investment project type
    And I choose Yes for "Will this company be the source of foreign equity investment?"
    And I populate the create Investment Project form
    Then I see the success message
    And the investment project local header is displayed
      | key           | value            | formatter              |
      | Status        | Ongoing - change |                        |
      | Project code  |                  | isProjectCodeFormatter |
      | Valuation     | Not yet valued   |                        |
      | Created on    |                  | isRecentDateFormatter  |
    And the Investment project summary key value details are displayed
      | key                           | value                                         |
      | Client                        | investmentProject.equitySource.name           |
      | Type of investment            | investmentProject.type                        |
      | Primary sector                | investmentProject.primarySector               |
      | Business activity             | investmentProject.businessActivities          |
      | Client contacts               | investmentProject.clientContact               |
      | Project description           | investmentProject.description                 |
      | Anonymised description        | investmentProject.anonymousDescription        |
      | Estimated land date           | investmentProject.estimatedLandDate           |
      | Actual land date              | investmentProject.actualLandDate              |
      | New or existing investor      | investmentProject.investorType                |
      | Level of involvement          | investmentProject.levelOfInvolvement          |
      | Specific investment programme | investmentProject.specificInvestmentProgramme |

  @investment-projects-create--archived-company
  Scenario: Archived company without Add investment project button

    When I navigate to the `companies.investments` page using `company` `Archived Ltd` fixture
    And I should not see the "Add investment project" button
