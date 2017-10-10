@search @ignore
Feature: Search
  As an existing user
  I would like to search the data hub
  So search for entities

  Background:
    Given I am an authenticated user on the data hub website

  @search--events
  Scenario: Search events
    And I navigate to the event list page
    When I click the add an event link
    And I populate the create event form to search
    And I click the save button
    Then I see the success message
    When I navigate to the dashboard
    And I search for the event
    Then I verify the tabs are displayed
    And I verify the Companies tab is active
    And I verify there is a results count 0
    When I click the Events tab
    Then I verify the Events tab is active
    And I verify there is a results count 1
    And I can view the event in the search results
