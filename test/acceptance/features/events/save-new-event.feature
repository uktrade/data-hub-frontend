@save-new-event
Feature: Save a new Event in Data hub
  As an Event organiser
  I would like to add an event record to data hub
  So that I can enable the collection of key events data

  Background:
    Given I am an authenticated user on the data hub website

  @save-new-event-submit @ignore
  Scenario: Verify event is submitted

    When I navigate to the create an event page
    And I enter all mandatory fields related to the event
    And I click on save button
    Then I see the Added new event confirmation message

  @save-new-event-mandatory-fields @ignore
  Scenario: Verify event mandatory fields

    And I click on save button
    Then I verify error message displayed for event name field
    And I verify error message displayed for event type field
    And I verify error message displayed for Address fields
    And I see the Added new event confirmation message is not displayed
    When I navigate to the create an event page


