@search
Feature: Search
  As an existing user
  I would like to search the data hub
  So search for entities

  @search--events
  Scenario: Search events

    Given I navigate to the event list page
    When I click the "Add event" link
    And I populate the create event form to search
    And I click the save button
    Then I see the success message
    When I search for the event
    Then I verify the tabs are displayed
    And the companies tab is active
    And there is a results count 0
    When the events tab is clicked
    Then the events tab is active
    And there is a results count 1
    And I can view the event in the search results

  @search--companies
  Scenario: Search companies

    Given a company is created
    Then I see the success message
    When I search for the company
    Then I verify the tabs are displayed
    And the companies tab is active
    And there is a results count 1
    And I can view the company in the search results
