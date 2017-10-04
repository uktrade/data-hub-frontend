@investment-projects-pipeline @ignore
Feature: View pipeline of investment projects
  As an existing user
  I would like to view all the Investment projects Pipeline
  And be able to filter using given filter options

  Background:
    Given I am an authenticated user on the data hub website

  @investment-projects-pipeline--landing-page
  Scenario: View pipeline of investment projects

    When I navigate to Investment projects pipeline
    Then I see display containing Project name, Value, Stage, Likelihood of landing, Land date
    And I see Project value, Number of jobs, Primary sector, Sub-sector filters displayed to the user
    And I see Advisor team name, Type of Investment, start date, end date and stage filters displayed to the user
    And I logout of Data Hub website

  @investment-projects-pipeline--stage
  Scenario Outline: Filter pipeline of investment projects by Project Stage

    When I navigate to Investment projects pipeline
    And I filter the display by Investment project stage <stage>
    Then I verify the display is changed based on the given project stage <stage>
    Examples:
      | stage      |
      | Prospect   |
      | Assign PM  |
      | Verify win |
      | Active     |
      | Won        |

  @investment-projects-pipeline--filter-by-project-type
  Scenario Outline: Filter pipeline of investment projects by Project type

    When I navigate to Investment projects pipeline
    And I filter the display by project type <investmentType>
    Then I verify the display is changed based on the given project type <investmentType>
    Examples:
      | investmentType       |
      | Commitment to invest |
      | FDI                  |
      | Non-FDI              |

  @investment-projects-pipeline--filter-by-project-sector
  Scenario: Filter pipeline of investment projects by Sector

    When I navigate to Investment projects pipeline
    And I filter the display by sector
    Then I verify the display is changed based on the given sector

  @investment-projects-pipeline--filter-by-project-date-range
  Scenario: Filter pipeline of investment projects by date range

    When I navigate to Investment projects pipeline
    And I filter the display by date range
    Then I verify the display is changed based on the given date range

  @investment-projects-pipeline--sort-by-project-stage
  Scenario: Sort pipeline of investment projects by Stage

    When I navigate to Investment projects pipeline
    And I sort the display by Stage
    Then I verify the display is sorted by stage

  @investment-projects-pipeline--project-details
  Scenario: Navigate to Project from pipeline

    When I navigate to Investment projects pipeline
    And I click on a Project name
    Then I verify user navigating to the Project details page
