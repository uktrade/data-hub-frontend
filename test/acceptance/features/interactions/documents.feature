@interactions-documents  @details
Feature: Interaction details

  @interactions-documents--documents-link
  Scenario: Interaction has Documents link
    When I navigate to the `interactions.Fixture` page using `interaction` `Attended gamma event` fixture
    Then there should not be a local nav
    And details view data for "Documents" should contain "View files and documents (will open another website)"

  @interactions-documents--no-documents-link
  Scenario: Interaction does not have Documents link
    When I navigate to the `interactions.Fixture` page using `interaction` `Provided funding information` fixture
    Then there should not be a local nav
    And details view data for "Documents" should contain "There are no files or documents"
