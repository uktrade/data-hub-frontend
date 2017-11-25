@events-details @details
Feature: Event details

  @events-details--documents-link
  Scenario: Event has Documents link

    When browsing to event fixture One-day exhibition
    Then there should not be a local nav
    And details view data for "Documents" should contain "View files and documents (will open another website)"

  @events-details--no-documents-link
  Scenario: Event does not have Documents link

    When browsing to event fixture Grand exhibition
    Then there should not be a local nav
    And details view data for "Documents" should contain "There are no files or documents"
