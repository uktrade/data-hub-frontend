@investment-projects-collection  @collection
Feature: View a list of Investment Projects
  As an Data hub user
  I would like to view a list of Investment Projects
  So I can search for Investment Projects and filter and sort the results

  @investment-projects-collection--view
  Scenario: View Investment Projects list

    When I navigate to the `companies.investments` page using `company` `Lambda plc` fixture
    And I click the "Add investment project" link
    Then I am taken to the "Add investment project" page
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
    When I navigate to the Investment Projects source of equity investment
    Then I can view the Investment project in the collection
      | text                | expected                            |
      | Investor            | investmentProject.equitySource.name |
      | Sector              | investmentProject.primarySector     |
      | Estimated land date | investmentProject.estimatedLandDate |
    And the Investment project has badges
      | text            | expected                            |
      | Stage           | investmentProject.stage             |
      | Investment type | investmentProject.type              |

  @investment-projects-collection--view--lep @lep
  Scenario: View Investment Projects list as LEP

    When I navigate to the `investments.list` page
    Then I confirm I am on the Investment projects page
    And the results summary for a project collection is present

  @investment-projects-collection--view--da @da
  Scenario: View Investment Projects list as DA

    When I navigate to the `investments.list` page
    Then I confirm I am on the Investment projects page
    And the results summary for a project collection is present
