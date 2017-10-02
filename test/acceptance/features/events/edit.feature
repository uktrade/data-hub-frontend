@events-edit
Feature: Edit an Event in Data hub
  As an Event organiser
  I would like to edit an event in data hub
  So that I can enable the changes of key events data

  Background:
    Given I am an authenticated user on the data hub website

  @events-edit--name
  Scenario: Edit event name

    When I navigate to event details page
    And I click on edit event button
    And I change text field @eventName to random words
    And I submit the form
    Then I verify that @eventNameFromDetails contains value I entered for @eventName

  @events-edit--type
  Scenario: Edit event type

    When I navigate to event details page
    And I click on edit event button
    And I change dropdown event_type to be Seminar
    And I submit the form
    Then I verify that @eventTypeFromDetails contains text Seminar
    When I click on edit event button
    And I change dropdown event_type to be Exhibition
    And I submit the form
    Then I verify that @eventTypeFromDetails contains text Exhibition

  @events-edit--dates
  Scenario: Edit event dates

    When I navigate to event details page
    And I click on edit event button
    And I change start date to decrease year by one
    And I submit the form
    Then I verify that the start date has been updated

  @events-edit--location-type
  Scenario: Edit event location type

    When I navigate to event details page
    And I click on edit event button
    And I change dropdown location_type to be HQ
    And I submit the form
    Then I verify that @locationTypeFromDetails contains text HQ
    When I click on edit event button
    And I change dropdown location_type to be Post
    And I submit the form
    Then I verify that @locationTypeFromDetails contains text Post

  @events-edit--address
  Scenario: Edit event address

    When I navigate to event details page
    And I click on edit event button
    And I change text field @addressLine1 to a random street address
    And I submit the form
    Then I verify that @addressFromDetails contains title-case value I entered for @addressLine1

  @events-edit--notes
  Scenario: Edit event notes

    When I navigate to event details page
    And I click on edit event button
    And I change text field @notes to a random paragraph
    And I submit the form
    Then I verify that @notesFromDetails contains value I entered for @notes

  @events-edit--team-hosting
  Scenario: Edit event team hosting

    When I navigate to event details page
    And I click on edit event button
    And I change dropdown lead_team to be CBBC Leeds
    And I submit the form
    Then I verify that @teamHostingFromDetails contains text CBBC Leeds
    When I click on edit event button
    And I change dropdown lead_team to be CBBC London
    And I submit the form
    Then I verify that @teamHostingFromDetails contains text CBBC London

  @events-edit--organiser
  Scenario: Edit event organiser

    When I navigate to event details page
    And I click on edit event button
    And I change dropdown organiser to be Adam Smith
    And I submit the form
    Then I verify that @organiserFromDetails contains text Adam Smith
    When I click on edit event button
    And I change dropdown organiser to be Adam Brown
    And I submit the form
    Then I verify that @organiserFromDetails contains text Adam Brown

  @events-edit--shared-teams
  Scenario: Edit event shared teams

    When I navigate to event details page
    And I click on edit event button
    And I click on form option @sharedYes
    And I change dropdown teams to be BPI
    And I submit the form
    Then I verify that @otherTeamsFromDetails contains text BPI
    When I click on edit event button
    And I click on form option @sharedYes
    And I change dropdown teams to be Intellect
    And I submit the form
    Then I verify that @otherTeamsFromDetails contains text Intellect

  @events-edit--related-programmes
  Scenario: Edit event related programmes

    When I navigate to event details page
    And I click on edit event button
    And I change dropdown related_programmes to be Grown in Britain
    And I submit the form
    Then I verify that @relatedProgrammesFromDetails contains text Grown in Britain
    When I click on edit event button
    And I change dropdown related_programmes to be Great Branded
    And I submit the form
    Then I verify that @relatedProgrammesFromDetails contains text Great Branded
