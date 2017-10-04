@events-edit
Feature: Edit an Event in Data hub
  As an Event organiser
  I would like to edit an event in data hub
  So that I can enable the changes of key events data

  Background:
    Given I am an authenticated user on the data hub website
    And I navigate to event details page
    And I click on edit event button

  @events-edit--name
  Scenario: Edit event name
    When I change form text field "name" to random words
    And I submit the form
    Then details heading should contain what I entered for "name" field

  @events-edit--type
  Scenario: Edit event type
    When I change form dropdown "event_type" to "Seminar"
    And I submit the form
    Then details view data for "Type of event" should contain "Seminar"
    When I click on edit event button
    And I change form dropdown "event_type" to Exhibition
    And I submit the form
    Then details view data for "Type of event" should contain "Exhibition"

  @events-edit--dates
  Scenario: Edit event dates
    When I change start date to decrease year by one
    And I submit the form
    Then details view data for "Event start date" should contain what I entered for "start_date_year" field

  @events-edit--location-type
  Scenario: Edit event location type
    When I change form dropdown "location_type" to "HQ"
    And I submit the form
    Then details view data for "Event location type" should contain "HQ"
    When I click on edit event button
    And I change form dropdown "location_type" to "Post"
    And I submit the form
    Then details view data for "Event location type" should contain "Post"

  @events-edit--address
  Scenario: Edit event address
    When I change form text field "address_1" to a random street address
    And I submit the form
    Then details view data for "Address" should contain what I entered for "address_1" field

  @events-edit--notes
  Scenario: Edit event notes
    When I change form text field "notes" to a random paragraph
    And I submit the form
    Then details view data for "Notes" should contain what I entered for "notes" field

  @events-edit--team-hosting
  Scenario: Edit event team hosting
    When I change form dropdown "lead_team" to "CBBC Leeds"
    And I submit the form
    Then details view data for "Lead team" should contain "CBBC Leeds"
    When I click on edit event button
    And I change form dropdown "lead_team" to "CBBC London"
    And I submit the form
    Then details view data for "Lead team" should contain "CBBC London"

  @events-edit--organiser
  Scenario: Edit event organiser
    When I change form dropdown "organiser" to "Michael Wining"
    And I submit the form
    Then details view data for "Organiser" should contain "Michael Wining"
    When I click on edit event button
    And I change form dropdown "organiser" to "Barry Oling"
    And I submit the form
    Then details view data for "Organiser" should contain "Barry Oling"

  @events-edit--shared-teams
  Scenario: Edit event shared teams
    When I select "Yes" for boolean option "event_shared"
    And I change form dropdown "teams" to "BPI"
    And I submit the form
    Then details view data for "Other teams" should contain "BPI"
    When I click on edit event button
    When I select "Yes" for boolean option "event_shared"
    And I change form dropdown "teams" to "Intellect"
    And I submit the form
    Then details view data for "Other teams" should contain "Intellect"

  @events-edit--related-programmes
  Scenario: Edit event related programmes
    When I change form dropdown "related_programmes" to "Grown in Britain"
    And I submit the form
    Then details view data for "Related programmes" should contain "Grown in Britain"
    When I click on edit event button
    And I change form dropdown "related_programmes" to "Great Branded"
    And I submit the form
    Then details view data for "Related programmes" should contain "Great Branded"
