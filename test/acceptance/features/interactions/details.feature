@interactions-details  @details
Feature: Interaction details

  @interactions-details--documents-link
  Scenario: Interaction has Documents link

    When browsing to interaction fixture Attended gamma event
    Then there should not be a local nav
    And details view data for "Documents" should contain "View files and documents (will open another website)"

  @interactions-details--no-documents-link
  Scenario: Interaction does not have Documents link

    When browsing to interaction fixture Provided funding information
    Then there should not be a local nav
    And details view data for "Documents" should contain "There are no files or documents"
