@interactions-investments-project
Feature: Investment project link

  @interactions-investments-project--investment-link
  Scenario: Interaction has an Investment project link
    When I navigate to the `interactions.fixture` page using `interaction` `Provided funding information` fixture
    Then there should not be a local nav
    And I click the "New hotel (FDI)" link
    Then I am taken to the "New hotel (FDI)" page
