@search
Feature: Search
  As an existing user
  I would like to search the data hub
  So search for entities

  @search--eventsselenium
  Scenario: Search events

    When I click the Events global nav link
    And I click the "Add event" link
    And I populate the create event form
    And I submit the form
    Then I see the success message
    When I search for the created event
    Then I verify the search tabs are displayed
      | text                |
      | Companies           |
      | Contacts            |
      | Events              |
      | Interactions        |
      | Investment projects |
      | Orders              |
    And the Companies search tab has 0 results
    When the Events search tab is clicked
    Then the Events search tab has 1 results
    And I can view the event in the search results

  @search--events--lep @lep
  Scenario: Search events directly as a LEP

    When I navigate to the `search.events` page
    Then I see the 403 error page

  @search--interactions--lep @lep
  Scenario: Search interactions directly as a LEP

    When I navigate to the `search.interactions` page
    Then I see the 403 error page

  @search--omis--lep @lep
  Scenario: Search orders directly as a LEP

    When I navigate to the `search.omis` page
    Then I see the 403 error page

  @search--events--da @da
  Scenario: Search events directly as a DA

    When I navigate to the `search.events` page
    Then I see the 403 error page

  @search--interactions--da @da
  Scenario: Search interactions directly as a DA

    When I navigate to the `search.interactions` page
    Then I see the 403 error page
