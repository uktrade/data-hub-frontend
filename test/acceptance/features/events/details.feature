@events-details @details
Feature: Event details

  @events-details--documents-link
  Scenario: Event has Documents link
    When I navigate to the `events.fixture` page using `event` `One-day exhibition` fixture
    Then there should be a local nav
      | text             |
      | Details          |
    And details view data for "Documents" should contain "View files and documents (will open another website)"

  @events-details--no-documents-link
  Scenario: Event does not have Documents link
    When I navigate to the `events.fixture` page using `event` `Grand exhibition` fixture
    Then there should be a local nav
      | text             |
      | Details          |
    And details view data for "Documents" should contain "There are no files or documents"
