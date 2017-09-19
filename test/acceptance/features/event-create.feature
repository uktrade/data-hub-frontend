@create-event
Feature: Create an Event in Data hub
  As an Event organiser
  I would like to add an event record to data hub
  So that I can enable the collection of key events data

  Background:
    Given I am an authenticated user on the data hub website

  @create-event-name
  Scenario: Verify event name field

    When I navigate to create an event page
    Then I verify the event name field is displayed

  @create-event-type
  Scenario: Verify event type field

    When I navigate to create an event page
    Then I verify the event type field is displayed

  @create-event-additional-refcode @ignore
  Scenario: Verify event additional reference code field

    When I navigate to create an event page
    Then I verify the event additional reference code field is displayed

  @create-event-dates
  Scenario: Verify event date fields

    When I navigate to create an event page
    Then I verify the event start date fields are displayed
    And I verify the event end date fields are displayed

  @create-event-location-type
  Scenario: Verify event location type field

    When I navigate to create an event page
    Then I verify the event location type field is displayed

  @create-event-address
  Scenario: Verify event address fields

    When I navigate to create an event page
    Then I verify the event address line1 field is displayed
    And I verify the event address line2 field is displayed
    And I verify the event address town field is displayed
    And I verify the event address county field is displayed
    And I verify the event address postcode field is displayed
    And I verify the event address country field is displayed

  @create-event-notes
  Scenario: Verify event notes field

    When I navigate to create an event page
    Then I verify the event notes field is displayed

  @create-event-team-hosting
  Scenario: Verify event Team hosting field

    When I navigate to create an event page
    Then I verify the event Team hosting field is displayed

  @create-event-organiser
  Scenario: Verify event organiser field

    When I navigate to create an event page
    Then I verify the event organiser field is displayed

  @create-event-shared
  Scenario: Verify event shared field

    When I navigate to create an event page
    Then I verify the event is shared or not field is displayed

  @create-event-shared-toggle
  Scenario: Verify event shared field toggling

    When I navigate to create an event page
    Then I verify the event is shared or not field is displayed
    When I choose the Yes option
    Then I verify the shared teams field is displayed
    When I choose the No option
    Then I verify the shared teams field is not displayed

  @create-event-shared-teams
  Scenario: Verify event shared teams field

    When I navigate to create an event page
    Then I verify the event is shared or not field is displayed
    When I choose the Yes option
    Then I verify the shared teams field is displayed
    When I select shared team 2
    And I add it to the shared teams list
    Then I verify there should be 2 shared teams lists
    And I verify there is the option to add another shared team

  @create-event-related-programmes
  Scenario: Verify event related programmes field

    When I navigate to create an event page
    Then I verify the event related programmes field is displayed
    When I select programme 2
    And I add it to the programmes list
    Then I verify there should be 2 programmes lists
    And I verify there is the option to add another programme

  @create-event-save
  Scenario: Verify event save button

    When I navigate to create an event page
    Then I verify the event save button is displayed

  @create-event-submit @ignore
  Scenario: Verify event is submitted

    When I navigate to create an event page
    And I enter all mandatory fields related to the event
    And I click on save button
    Then I see the Added new event confirmation message

  @create-event-mandatory-fields @ignore
  Scenario: Verify event mandatory fields

    When I navigate to create an event page
    And I click on save button
    Then I verify error message displayed for event name field
    And I verify error message displayed for event type field
    And I verify error message displayed for Address fields
    And I see the Added new event confirmation message is not displayed

  @create-event-display @ignore
  Scenario: Verify event is displayed

    When I navigate to create an event page
    And I enter all mandatory fields related to the event
    And I click on save button
    Then I see the Added new event confirmation message
    And I see the event is displayed correctly with all field values
