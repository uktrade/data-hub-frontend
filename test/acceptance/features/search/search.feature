@search
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
    And the companies tab is active
    And there is a results count 0
    When I click the Events tab
    Then the events tab is active
    And there is a results count 1
    And I can view the event in the search results

  @search--companies @ignore
  Scenario: Search companies
    And I navigate to the company list page
    When a company is created to search
    Then I see the success message
    When I navigate to the dashboard
    And I search for the company
    Then I verify the tabs are displayed
    And the companies tab is active
    And there is a results count 1
    And I can view the company in the search results
