@edit-event @ignore
Feature: Edit an Event in Data hub
  As an Event organiser
  I would like to edit an event in data hub
  So that I can enable the changes of key events data

  Background:
    Given I am an authenticated user on the data hub website

  @edit-event-name @ignore
  Scenario: Edit event name

    When I navigate to event details page
    And I click on edit event button
    And I change event name field to a new value
    And I click on save button
    Then I see the event record updated confirmation message
    And I verify the event name is updated with new value

  @edit-event-type @ignore
  Scenario: Edit event type

    When I navigate to event details page
    And I click on edit event button
    And I change event type field to a new value
    And I click on save button
    Then I see the event record updated confirmation message
    And I verify the event type is updated with new value

  @edit-event-refcode @ignore
  Scenario: Edit event additional reference code

    When I navigate to event details page
    And I click on edit event button
    And I change event additional reference code field to a new value
    And I click on save button
    Then I see the event record updated confirmation message
    And I verify the event additional reference code is updated with new value

  @edit-event-dates @ignore
  Scenario: Edit event dates

    When I navigate to event details page
    And I click on edit event button
    And I change event dates field to a new value
    And I click on save button
    Then I see the event record updated confirmation message
    And I verify the event dates is updated with new value

  @edit-event-location-type @ignore
  Scenario: Edit event location type

    When I navigate to event details page
    And I click on edit event button
    And I change event location type field to a new value
    And I click on save button
    Then I see the event record updated confirmation message
    And I verify the event location type is updated with new value

  @edit-event-address @ignore
  Scenario: Edit event address

    When I navigate to event details page
    And I click on edit event button
    And I change event address field to a new value
    And I click on save button
    Then I see the event record updated confirmation message
    And I verify the event address is updated with new value

  @edit-event-notes @ignore
  Scenario: Edit event notes

    When I navigate to event details page
    And I click on edit event button
    And I change event notes field to a new value
    And I click on save button
    Then I see the event record updated confirmation message
    And I verify the event notes is updated with new value

  @edit-event-team-hosting @ignore
  Scenario: Edit event team hosting

    When I navigate to event details page
    And I click on edit event button
    And I change event team hosting field to a new value
    And I click on save button
    Then I see the event record updated confirmation message
    And I verify the event team hosting is updated with new value

  @edit-event-organiser @ignore
  Scenario: Edit event organiser

    When I navigate to event details page
    And I click on edit event button
    And I change event organiser field to a new value
    And I click on save button
    Then I see the event record updated confirmation message
    And I verify the event organiser is updated with new value

  @edit-event-shared-teams @ignore
  Scenario: Edit event shared teams

    When I navigate to event details page
    And I click on edit event button
    And I change event shared teams field to a new value
    And I click on save button
    Then I see the event record updated confirmation message
    And I verify the event shared teams is updated with new value

  @edit-event-related-programmes @ignore
  Scenario: Edit event related programmes

    When I navigate to event details page
    And I click on edit event button
    And I change event related programmes field to a new value
    And I click on save button
    Then I see the event record updated confirmation message
    And I verify the event related programmes is updated with new value
