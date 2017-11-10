@events-list
Feature: View a list of events
  As an Event organiser
  I would like to view a list of events
  So search for events and filter and sort the results

  @events-list--add
  Scenario: Add event

    Given I navigate to the event list page
    When I click the add an event link
    Then I am taken to the create event page

  @events-list--view
  Scenario: View event list

    Given I navigate to the event list page
    When I click the add an event link
    And I populate the create event form
    And I click the save button
    Then I see the success message
    When I navigate to the event list page
    Then I can view the event

  @events-list--view-uk-region
  Scenario: View event uk region

    Given I navigate to the event list page
    When I click the add an event link
    And I populate the create event form with United Kingdom and a region
    And I click the save button
    Then I see the success message
    When I navigate to the event list page
    Then I can view the event country and region

  @events-list--filter
  Scenario: Filter event list

    Given I navigate to the event list page
    When I click the add an event link
    And I populate the create event form
    And I click the save button
    Then I see the success message
    When I navigate to the event list page
    And I filter the events list by name
    Then I can view the event
    And I filter the events list by organiser
    Then I can view the event
    And I filter the events list by event type
    Then I can view the event
    And I filter the events list by country
    Then I can view the event
    And I filter the events list by start date
    Then I can view the event

  @events-list--sort
  Scenario: Sort event list

    Given I navigate to the event list page
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
    And I sort the events list name Z-A
    Then I see the list in Z-A alphabetical order
    And I sort the events list by recently updated
    Then I see the list in descending recently updated order
    And I sort the events list by least recently updated
    Then I see the list in ascending recently updated order

