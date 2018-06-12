
Feature: Event Navigation

  @events-navigation
  Scenario: Event navigation for details and attendees
    When I navigate to the `events.fixture` page using `event` `One-day exhibition` fixture
    Then there should be a local nav
      | text             |
      | Details          |
      | Attendees        |
