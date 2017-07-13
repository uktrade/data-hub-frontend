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
    And I see Project value, Number of jobs, Primary sector, Sub-sector, Advisor team name, Type of Investment, start date, end date and stage filters displayed to the user
    And I logout of Data Hub website

	@view-filter-by-project-value
	Scenario: Filter pipeline of investment projects by Project value
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    And I filter the display by Project value
    Then I verify the display is changed based on the given Project value

	@view-filter-by-number-of-jobs
	Scenario: Filter pipeline of investment projects by Number of Jobs
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    And I filter the display by Number of jobs
    Then I verify the display is changed based on the given Number of Jobs

	@view-filter-by-project-stage
	Scenario: Filter pipeline of investment projects by Project Stage
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    And I filter the display by Investment project Stage
    Then I verify the display is changed based on the given project stage

	@view-filter-by-project-type
	Scenario: Filter pipeline of investment projects by Project type
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    And I filter the display by project type
    Then I verify the display is changed based on the given project type

	@view-filter-by-project-sector
	Scenario: Filter pipeline of investment projects by Sector
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    And I filter the display by sector
    Then I verify the display is changed based on the given sector

	@view-filter-by-project-sub-sector
	Scenario: Filter pipeline of investment projects by sub-Sector
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    And I filter the display by sub-sector
    Then I verify the display is changed based on the given sub-sector

	@view-filter-by-project-status
	Scenario: Filter pipeline of investment projects by status
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    And I filter the display by status
    Then I verify the display is changed based on the given status

	@view-filter-by-project-advisor-name-teams
	Scenario: Filter pipeline of investment projects by team name
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    And I filter the display by advisor name teams
    Then I verify the display is changed based on the given advisor name teams

	@view-filter-by-project-date-range
	Scenario: Filter pipeline of investment projects by date range
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    And I filter the display by date range
    Then I verify the display is changed based on the given date range

	@sort-by-project-value
	Scenario: Sort pipeline of investment projects by Value
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    And I sort the display by value
    Then I verify the display is sorted by value

	@sort-by-project-stage
	Scenario: Sort pipeline of investment projects by Stage
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    And I sort the display by Stage
    Then I verify the display is sorted by stage

	@sort-by-project-likelihood-of-landing
	Scenario: Sort pipeline of investment projects by likelihood of landing
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    And I sort the display by likelihood of landing
    Then I verify the display is sorted by likelihood of landing

	@sort-by-project-land-date
	Scenario: Sort pipeline of investment projects by land date
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    And I sort the display by land date
    Then I verify the display is sorted by land date

	@navigate-project-details
	Scenario: Navigate to Project from pipeline
    Given I am an authenticated user on Data Hub website
    When I navigate to Investment projects pipeline
    And I click on a Project name
    Then I verify user navigating to the Project details page

	@assign-pm-stage-view-in-pipeline
	Scenario: Create new investment project with Assign PM stage to view in Pipeline
    Given I am an authenticated user on Data Hub website
    When I Create a new Investment project
    And I complete the Prospect stage by entering Total investment Value, Jobs, Requirements and Location fields
    And I move the project to Assign PM stage
    And I navigate to Investment projects pipeline
    Then I verify newly created investment project within Assign PM stage is displayed in the list
