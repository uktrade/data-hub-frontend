@investment-projects-details  @details
Feature: Investment project details

  @investment-projects-details--documents-link
  Scenario: Investment project has Documents link

    When I navigate to investment project fixture New hotel (commitment to invest)
    And I click the Documents local nav link
    Then view should contain the Documents link

  @investment-projects-details--no-documents-link
  Scenario: Investment project does not have Documents link

    When I navigate to investment project fixture New rollercoaster
    And I click the Documents local nav link
    Then view should not contain the Documents link
