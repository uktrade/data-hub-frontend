@create-event @ignore
Feature: Create an Event in Data hub
As an Event organiser
I would like to add an event record to data hub
So that I can enable the collection of key events data

@create-event-name @ignore
Scenario: Verify event name field
   Given I am an authenticated user on Data Hub website
   When I navigate to create an event page
   Then I verify the event name field is displayed

@create-event-type @ignore
Scenario: Verify event type field
   Given I am an authenticated user on Data Hub website
   When I navigate to create an event page
   Then I verify the event type field is displayed

@create-event-additional-refcode @ignore
Scenario: Verify event additional reference code field
   Given I am an authenticated user on Data Hub website
   When I navigate to create an event page
   Then I verify the event additional reference code field is displayed

@create-event-dates @ignore
Scenario: Verify event date fields
   Given I am an authenticated user on Data Hub website
   When I navigate to create an event page
   Then I verify the event start date field is displayed
   And I verify the event end date field is displayed

@create-event-location-type @ignore
Scenario: Verify event location type field
   Given I am an authenticated user on Data Hub website
   When I navigate to create an event page
   Then I verify the event location type field is displayed

@create-event-address @ignore
Scenario: Verify event address fields
   Given I am an authenticated user on Data Hub website
   When I navigate to create an event page
   Then I verify the event address line1 field is displayed
   And I verify the event address line2 field is displayed
   And I verify the event address town field is displayed
   And I verify the event address postcode field is displayed
   And I verify the event address country field is displayed

@create-event-notes @ignore
Scenario: Verify event notes field
   Given I am an authenticated user on Data Hub website
   When I navigate to create an event page
   Then I verify the event notes field is displayed

@create-event-team-hosting @ignore
Scenario: Verify event Team hosting field
   Given I am an authenticated user on Data Hub website
   When I navigate to create an event page
   Then I verify the event Team hosting field is displayed

@create-event-organiser @ignore
Scenario: Verify event organiser field
   Given I am an authenticated user on Data Hub website
   When I navigate to create an event page
   Then I verify the event organiser field is displayed

@create-event-shared @ignore
Scenario: Verify event shared field
   Given I am an authenticated user on Data Hub website
   When I navigate to create an event page
   Then I verify the event is shared or not field is displayed

@create-event-shared-teams @ignore
Scenario: Verify event shared teams field
   Given I am an authenticated user on Data Hub website
   When I navigate to create an event page
   Then I verify the event is shared or not field is displayed
   When I choose Yes option
   Then I verify the shared teams field is displayed
   When I select a shared team name
   And I add it to the list
   Then I verify there is option to add another team

@create-event-related-programmes @ignore
Scenario: Verify event related programmes field
   Given I am an authenticated user on Data Hub website
   When I navigate to create an event page
   Then I verify the event related programmes field is displayed
   When I select a related programme name
   And I add it to the list
   Then I verify there is option to add another programme name

@create-event-save @ignore
Scenario: Verify event save button
   Given I am an authenticated user on Data Hub website
   When I navigate to create an event page
   Then I verify the event save button is displayed

@create-event-submit @ignore
Scenario: Verify event is submitted
   Given I am an authenticated user on Data Hub website
   When I navigate to create an event page
   And I enter all mandatory fields related to the event
   And I click on save button
   Then I see the Added new event confirmation message


@create-event-mandatory-fields @ignore
Scenario: Verify event mandatory fields
   Given I am an authenticated user on Data Hub website
   When I navigate to create an event page
   And I click on save button
   Then I verify error message displayed for event name field
   And I verify error message displayed for event type field
   And I verify error message displayed for Address fields
   And I see the Added new event confirmation message is not displayed


@create-event-display @ignore
Scenario: Verify event is displayed
   Given I am an authenticated user on Data Hub website
   When I navigate to create an event page
   And I enter all mandatory fields related to the event
   And I click on save button
   Then I see the Added new event confirmation message
   And I see the event is displayed correctly with all field values
