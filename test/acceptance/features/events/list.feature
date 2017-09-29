@events-list
Feature: View a list of events
  As an Event organiser
  I would like to view a list of events
  So search for events and filter and sort the results

  Background:
    Given I am an authenticated user on the data hub website

  @events-list--add
  Scenario: Add event
    And I navigate to the event list page
    When I click the add an event link
    Then I am taken to the create event page

  @events-list--view
  Scenario: View event list
    And I navigate to the event list page
    When I click the add an event link
    And I populate the create event form
    And I click the save button
    Then I see the success message
    When I navigate to the event list page
    Then I can view the event

  @events-list--view-uk-region
  Scenario: View event uk region
    And I navigate to the event list page
    When I click the add an event link
    And I populate the create event form
    And I select country as United Kingdom with a region
    And I click the save button
    Then I see the success message
    When I navigate to the event list page
    Then I can view the event country and region

  @events-list--filter
  Scenario: Filter event list
    And I navigate to the event list page
    When I click the add an event link
    And I populate the create event form
    And I click the save button
    Then I see the success message
    When I navigate to the event list page
    And I filter the events list
    Then I can view the event

  @events-list--sort-a-z
  Scenario: Sort event list A-Z
    And I navigate to the event list page
    When I click the add an event link
    And I populate the create event form
    And I click the save button
    Then I see the success message
    When I navigate to the event list page
    And I click the add an event link
    And I populate the create event form
    When I click the save button
    Then I see the success message
    When I navigate to the event list page
    And I sort the events list name A-Z
    Then I see the list in A-Z alphabetical order

  @events-list--sort-z-a
  Scenario: Sort event list Z-A
    And I navigate to the event list page
    When I click the add an event link
    And I populate the create event form
    And I click the save button
    Then I see the success message
    When I navigate to the event list page
    And I click the add an event link
    And I populate the create event form
    When I click the save button
    Then I see the success message
    When I navigate to the event list page
    And I sort the events list name Z-A
    Then I see the list in Z-A alphabetical order

