@events-save
Feature: Save a new Event in Data hub
  As an Event organiser
  I would like to add an event record to data hub
  So that I can enable the collection of key events data

  @events-save--submit
  Scenario: Verify event is submitted

    Given I create an event
    And I submit the form
    Then I see the success message

  @events-save--mandatory-fields
  Scenario: Verify event mandatory fields

    When I click the Events global nav link
    And I click the "Add event" link
    And I submit the form
    Then the event fields have error messages
    And I see form error summary

  @events-save--uk-region
  Scenario: Verify event UK region mandatory field
    When I click the Events global nav link
    And I click the "Add event" link
    And I populate the create event form with United Kingdom and without a region
    And I submit the form
    And I verify the event UK region has an error message
    Then I see form error summary


