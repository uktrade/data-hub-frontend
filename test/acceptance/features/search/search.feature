@search
Feature: Search
  As an existing user
  I would like to search the data hub
  So search for entities

  @search--events
  Scenario: Search events

    Given I navigate to the event list page
    When I click the "Add event" link
    And I populate the create event form
    And I click the save button
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
    And the Companies search tab is active
    And there is a results count 0
    When the Events search tab is clicked
    Then the Events search tab is active
    And there is a results count 1
    And I can view the event in the search results

  @search--companies
  Scenario: Search companies

    Given a company is created
    Then I see the success message
    When I search for the created company
    Then I verify the search tabs are displayed
      | text                |
      | Companies           |
      | Contacts            |
      | Events              |
      | Interactions        |
      | Investment projects |
      | Orders              |
    And the Companies search tab is active
    And there is a results count 1
    And I can view the company in the search results
