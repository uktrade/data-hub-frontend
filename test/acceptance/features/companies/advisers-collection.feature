@companies-advisers-collection @collection
Feature: View collection of advisers for a company

  @companies-advisers-collection--view
  Scenario: View companies adviser collection
    When I navigate to the `companies.advisers` page using `company` `One List Corp` fixture
    Then details content heading should contain "Advisers assigned to One List Corp"
    And I can view the entity list
