@events-details @details
Feature: Event details

  @events-details--documents-link
  Scenario: Event has Documents link
    When I navigate to the `events.fixture` page using `event` `One-day exhibition` fixture
    And details view data for "Documents" should contain "View files and documents (will open another website)"

  @events-details--no-documents-link
  Scenario: Event does not have Documents link
    When I navigate to the `events.fixture` page using `event` `Grand exhibition` fixture
    And details view data for "Documents" should contain "There are no files or documents"

  @event-details--disabled
  Scenario: Event is disabled
    When I navigate to the `events.fixture` page using `event` `Teddy bear expo` fixture
    Then details view data for "Disabled" should contain "5 September 2017"
    And the heading should have a "Disabled" badge
    And I should not see the "edit" button
