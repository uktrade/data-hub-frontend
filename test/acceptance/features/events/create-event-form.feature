@events__create-event-form
Feature: Create an Event in Data hub
  As an Event organiser
  I would like to add an event record to data hub
  So that I can enable the collection of key events data

  Background:
    Given I am an authenticated user on the data hub website

  @events__create-event-form--fields
  Scenario: Verify event form fields

    When I navigate to the create an event page
    Then I verify the event name field is displayed
    And I verify the event type field is displayed
    And I verify the event start date fields are displayed
    And I verify the event end date fields are displayed
    And I verify the event location type field is displayed
    And I verify the event address line1 field is displayed
    And I verify the event address line2 field is displayed
    And I verify the event address town field is displayed
    And I verify the event address county field is displayed
    And I verify the event address postcode field is displayed
    And I verify the event address country field is displayed
    And I verify the event UK region field is not displayed
    And I verify the event notes field is displayed
    And I verify the event Team hosting field is displayed
    And I verify the event organiser field is displayed
    And I verify the event is shared or not field is displayed
    And I verify the shared teams field is not displayed
    And I verify the event related programmes field is displayed
    And I verify the event save button is displayed

  @events__create-event-form--toggle-uk-region
  Scenario: Verify event UK region toggling

    When I navigate to the create an event page
    And I choose the United Kingdom country option
    Then I verify the event UK region field is displayed
    When I choose the Afghanistan country option
    Then I verify the event UK region field is not displayed

  @events__create-event-form--toggle-shared
  Scenario: Verify event shared field toggling

    When I navigate to the create an event page
    And I choose the Yes option
    Then I verify the shared teams field is displayed
    When I choose the No option
    Then I verify the shared teams field is not displayed

  @events__create-event-form--add-teams
  Scenario: Verify event shared teams field

    When I navigate to the create an event page
    And I choose the Yes option
    And I select shared team 2
    And I add it to the shared teams list
    Then I verify there should be 2 shared teams lists
    And I verify there is the option to add another shared team

  @events__create-event-form--add-related-programmes
  Scenario: Verify event related programmes field

    When I navigate to the create an event page
    And I select programme 2
    And I add it to the programmes list
    Then I verify there should be 2 programmes lists
    And I verify there is the option to add another programme
