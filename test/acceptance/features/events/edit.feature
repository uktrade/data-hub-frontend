# TODO this work feels a little verbose have a look at moving into a smaller amount of steps
# TODO this work relies on the first step being run (to create a company) this needs to be done on each step once the above has been done
@events-edit
Feature: Edit an Event in Data hub
  As an Event organiser
  I would like to edit an event in data hub
  So that I can enable the changes of key events data

  @events-edit--name
  Scenario: Edit event name

    When I navigate to the `events.list` page
    And I choose the first item in the collection
    And I click the "Edit event" link
    When I change form text field "name" to random words
    And I submit the form
    Then details heading should contain what I entered for "name" field

  @events-edit--type
  Scenario: Edit event type

    When I navigate to the `events.list` page
    And I choose the first item in the collection
    And I click the "Edit event" link
    And I change form dropdown "event_type" to "Seminar"
    And I submit the form
    Then details view data for "Type of event" should contain "Seminar"
    And I click the "Edit event" link
    And I change form dropdown "event_type" to Exhibition
    And I submit the form
    Then details view data for "Type of event" should contain "Exhibition"

  @events-edit--dates
  Scenario: Edit event dates

    When I navigate to the `events.list` page
    And I choose the first item in the collection
    And I click the "Edit event" link
    When I change start date to decrease year by one
    And I submit the form
    Then details view data for "Event start date" should contain what I entered for "start_date_year" field

  @events-edit--location-type
  Scenario: Edit event location type

    When I navigate to the `events.list` page
    And I choose the first item in the collection
    And I click the "Edit event" link
    And I change form dropdown "location_type" to "HQ"
    And I submit the form
    Then details view data for "Event location type" should contain "HQ"
    And I click the "Edit event" link
    And I change form dropdown "location_type" to "Post"
    And I submit the form
    Then details view data for "Event location type" should contain "Post"

  @events-edit--address
  Scenario: Edit event address

    When I navigate to the `events.list` page
    And I choose the first item in the collection
    And I click the "Edit event" link
    And I change form text field "address_1" to a random street address
    And I submit the form
    Then details view data for "Address" should contain what I entered for "address_1" field

  @events-edit--notes
  Scenario: Edit event notes

    When I navigate to the `events.list` page
    And I choose the first item in the collection
    And I click the "Edit event" link
    And I change form text field "notes" to a random paragraph
    And I submit the form
    Then details view data for "Notes" should contain what I entered for "notes" field

  @events-edit--team-hosting
  Scenario: Edit event team hosting

    When I navigate to the `events.list` page
    And I choose the first item in the collection
    And I click the "Edit event" link
    And I change form dropdown "lead_team" to "CBBC Leeds"
    And I submit the form
    Then details view data for "Lead team" should contain "CBBC Leeds"
    And I click the "Edit event" link
    And I change form dropdown "lead_team" to "CBBC London"
    And I submit the form
    Then details view data for "Lead team" should contain "CBBC London"

  @events-edit--shared-teams
  Scenario: Edit event shared teams

    When I navigate to the `events.list` page
    And I choose the first item in the collection
    And I click the "Edit event" link
    And I select "Yes" for boolean option "event_shared"
    And I change form dropdown "teams" to "BPI"
    And I submit the form
    Then details view data for "Other teams" should contain "BPI"
    And I click the "Edit event" link
    When I select "Yes" for boolean option "event_shared"
    And I change form dropdown "teams" to "Intellect"
    And I submit the form
    Then details view data for "Other teams" should contain "Intellect"

  @events-edit--related-programmes
  Scenario: Edit event related programmes

    When I navigate to the `events.list` page
    And I choose the first item in the collection
    And I click the "Edit event" link
    And I change form dropdown "related_programmes" to "Grown in Britain"
    And I submit the form
    Then details view data for "Related programmes" should contain "Grown in Britain"
    And I click the "Edit event" link
    And I change form dropdown "related_programmes" to "GREAT Branded"
    And I submit the form
    Then details view data for "Related programmes" should contain "GREAT Branded"
