@events__save-new-event
Feature: Save a new Event in Data hub
  As an Event organiser
  I would like to add an event record to data hub
  So that I can enable the collection of key events data

  Background:
    Given I am an authenticated user on the data hub website

  @events__save-new-event--submit
  Scenario: Verify event is submitted

    When I navigate to the create an event page
    And I enter all mandatory fields related to the event
    And I click the save button
    Then I see the success message

  @events__save-new-event--mandatory-fields
  Scenario: Verify event mandatory fields

    When I navigate to the create an event page
    And I click the save button
    Then I verify the event name has an error message
    And I verify the event type has an error message
    And I verify the event address line 1 has an error message
    And I verify the event address town has an error message
    And I verify the event address country has an error message
    And I verify the event services has an error message
    Then I see the error summary

  @events__save-new-event--uk-region
  Scenario: Verify event UK region mandatory field

    When I navigate to the create an event page
    And I enter all mandatory fields related to the event
    And I choose the United Kingdom country option
    And I click the save button
    And I verify the event UK region has an error message
    Then I see the error summary


