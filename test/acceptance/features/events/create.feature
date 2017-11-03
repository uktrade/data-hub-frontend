@events-create
Feature: Create an Event in Data hub
  As an Event organiser
  I would like to add an event record to data hub
  So that I can enable the collection of key events data

  @events-create--fields
  Scenario: Verify event form fields

    Given I navigate to the create an event page
    Then I verify the event name field is displayed
    Then I verify the event type field is displayed
    Then I verify the event start date fields are displayed
    Then I verify the event end date fields are displayed
    Then I verify the event location type field is displayed
    Then I verify the event address line1 field is displayed
    Then I verify the event address line2 field is displayed
    Then I verify the event address town field is displayed
    Then I verify the event address county field is displayed
    Then I verify the event address postcode field is displayed
    Then I verify the event address country field is displayed
    Then I verify the event UK region field is not displayed
    Then I verify the event notes field is displayed
    Then I verify the event Team hosting field is displayed
    Then I verify the event services field is displayed
    Then I verify the event organiser field is displayed
    Then I verify the event is shared or not field is displayed
    Then I verify the shared teams field is not displayed
    Then I verify the event related programmes field is displayed
    Then I verify the event save button is displayed

  @events-create--toggle-uk-region
  Scenario: Verify event UK region toggling

    Given I navigate to the create an event page
    When I choose the United Kingdom country option
    Then I verify the event UK region field is displayed
    Then I choose the Afghanistan country option
    Then I verify the event UK region field is not displayed

  @events-create--toggle-shared
  Scenario: Verify event shared field toggling

    Given I navigate to the create an event page
    When I choose the Yes option
    Then I verify the shared teams field is displayed
    Then I choose the No option
    Then I verify the shared teams field is not displayed

  @events-create--add-teams
  Scenario: Verify event shared teams field

    Given I navigate to the create an event page
    When I choose the Yes option
    And I select shared team 2
    And I add it to the shared teams list
    Then I verify there should be 2 shared teams lists
    Then I verify there is the option to add another shared team

  @events-create--add-related-programmes
  Scenario: Verify event related programmes field

    Given I navigate to the create an event page
    When I select programme 2
    Then I add it to the programmes list
    Then I verify there should be 2 programmes lists
    Then I verify there is the option to add another programme
