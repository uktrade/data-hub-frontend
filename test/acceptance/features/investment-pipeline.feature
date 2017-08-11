@pipeline-investment-projects
Feature: View pipeline of investment projects
  As an existing user
  I would like to view all the Investment projects Pipeline
  And be able to filter using given filter options

  @view-investment-pipeline-landingpage
  Scenario: View pipeline of investment projects
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    Then I see display containing Project name, Value, Stage, Likelihood of landing, Land date
    And I see Project value, Number of jobs, Primary sector, Sub-sector filters displayed to the user
    And I see Advisor team name, Type of Investment, start date, end date and stage filters displayed to the user
    And I logout of Data Hub website

	@view-filter-by-project-stage
	Scenario Outline: Filter pipeline of investment projects by Project Stage
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    And I filter the display by Investment project stage <stage>
    Then I verify the display is changed based on the given project stage <stage>
    Examples:
    |stage|
    |Prospect|
    |Assign PM|
    |Verify win|
    |Active    |
    |Won       |

	@view-filter-by-project-type
	Scenario Outline: Filter pipeline of investment projects by Project type
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    And I filter the display by project type <investmentType>
    Then I verify the display is changed based on the given project type <investmentType>
    Examples:
    |investmentType|
    |Commitment to invest|
    |FDI                 |
    |Non-FDI             |

	@view-filter-by-project-sector
	Scenario: Filter pipeline of investment projects by Sector
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    And I filter the display by sector
    Then I verify the display is changed based on the given sector

	@view-filter-by-project-date-range
	Scenario: Filter pipeline of investment projects by date range
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    And I filter the display by date range
    Then I verify the display is changed based on the given date range

	@sort-by-project-stage
	Scenario: Sort pipeline of investment projects by Stage
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    And I sort the display by Stage
    Then I verify the display is sorted by stage

	@navigate-project-details
	Scenario: Navigate to Project from pipeline
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    And I click on a Project name
    Then I verify user navigating to the Project details page
